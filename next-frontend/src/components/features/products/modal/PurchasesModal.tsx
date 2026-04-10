import CloseButton from "@/components/ui/closeButton";
import { useState } from "react";
import { PurchasesService } from "@/service/purchases.service";
import { Purchases } from "@/types/purchases.type";
import { useBudgetList } from "@/hooks/useBudgetList";
import { Button } from "@/components/ui/button";
import {
  getCurrencyLabel,
  getPriceTypeLabel,
  PRICE_TYPE_LABELS,
} from "@/utils/budget.utils";
import { formatWithCommas } from "@/utils/formatWithCommas";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

type PriceKey = keyof typeof PRICE_TYPE_LABELS;

type PurchasesModalProps = Readonly<{
  productCode: string;
  closeForm: () => void;
}>;

function PurchasesModal({ productCode, closeForm }: PurchasesModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(oneYearAgo);
  const [endDate, setEndDate] = useState(today);
  const [prices, setPrices] = useState<Purchases | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const { addItem, isInBudget } = useBudgetList();
  const alreadyAdded = isInBudget(productCode);

  const handleSelect = (type: PriceKey) => {
    if (!prices) return;
    const isUpdate = isInBudget(prices.productCode);
    addItem({
      productCode: prices.productCode,
      productCode2: prices.productCode2,
      description: prices.description,
      selectedType: getPriceTypeLabel(type),
      ...prices[type],
    });
    if (isUpdate) {
      toast.info("Precio actualizado en tu presupuesto", {
        description: `${prices.description} fue reemplazado con ${getPriceTypeLabel(type).toLowerCase()}.`,
      });
    } else {
      toast.success("Agregado a tu presupuesto", {
        description: `${prices.description} fue añadido correctamente.`,
      });
    }
  };

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError("Por favor ingresa ambas fechas.");
      return;
    }
    if (startDate > endDate) {
      setError("La fecha inicio no puede ser mayor a la fecha fin.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setSearched(true);
    try {
      const data = await PurchasesService.getPrices(productCode, startDate, endDate);
      setPrices(data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error al consultar los precios.");
      setPrices(null);
    } finally {
      setIsLoading(false);
    }
  };

  const rows: Array<{ key: PriceKey } & Purchases[PriceKey]> = prices
    ? (Object.keys(PRICE_TYPE_LABELS) as PriceKey[]).map((key) => ({
        key,
        ...prices[key],
      }))
    : [];

  return (
    <div className="fixed inset-0 flex justify-center items-start bg-black/40 p-6 z-50">
      <div className="relative w-full max-w-3xl rounded-xl bg-gray-50 shadow-xl overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <CloseButton closeForm={closeForm} />
        </div>
        <div className="max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col gap-6 px-8 py-6">

            <div>
              <h2 className="text-lg font-semibold text-gray-800">Historial de precios</h2>
              <p className="text-sm text-gray-500">Código: {productCode}</p>
            </div>

            {/* Banner: producto ya en presupuesto */}
            {alreadyAdded && (
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <ShoppingCart className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <div>
                  <p className="font-medium">Este producto ya está en tu presupuesto</p>
                  <p className="text-amber-700 text-xs mt-0.5">
                    Si seleccionas un precio, reemplazará el que ya fue registrado.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm font-medium text-gray-700">Fecha inicio</label>
                <input
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm font-medium text-gray-700">Fecha fin</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  max={today}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Consultando..." : "Consultar"}
              </Button>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            {searched && !isLoading && (
              <>
                {prices ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3">Tipo</th>
                          <th className="px-4 py-3">Precio</th>
                          <th className="px-4 py-3">Fecha de compra</th>
                          <th className="px-4 py-3">Proveedor</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {rows.map((row) => (
                          <tr key={row.key} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-700">
                              {getPriceTypeLabel(row.key)}
                            </td>
                            <td className="px-4 py-3 text-gray-800 font-semibold">
                              S/{formatWithCommas(row.price)}
                              {row.currency === "02" && (
                                <div className="text-xs text-gray-500">
                                  ({getCurrencyLabel(row.currency)} {row.originalPrice.toFixed(2)} | TC: {row.exchangeRate})
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{row.transactionDate}</td>
                            <td className="px-4 py-3 text-gray-600">{row.supplier}</td>
                            <td className="px-4 py-3">
                              <Button
                                onClick={() => handleSelect(row.key)}
                                variant={alreadyAdded ? "outline" : "default"}
                              >
                                {alreadyAdded ? "Reemplazar" : "Agregar"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No se encontraron registros para el rango de fechas seleccionado.
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  * Los precios están expresados en soles (PEN). Las compras en dólares (USD) fueron
                  convertidas usando el tipo de cambio de la fecha. Los precios incluyen IGV.
                </p>
              </>
            )}

            {!searched && (
              <div className="text-center py-8 text-gray-400 text-sm">
                Selecciona un rango de fechas y presiona{" "}
                <span className="font-medium">Consultar</span>.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchasesModal;