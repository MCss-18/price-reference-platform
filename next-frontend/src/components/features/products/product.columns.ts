import { BudgetItem } from "@/types/BudgetItem.type";
import { ColumnConfig } from "@/utils/exportToExcel";

export const PRODUCT_EXPORT_COLUMNS: ColumnConfig<BudgetItem>[] = [
  { key: "productCode", label: "ID", excluded: true },
  { key: "productCode2", label: "Codigo" },
  { key: "description", label: "Descripción" },
  { key: "selectedType",      label: "Tipo" },
  { key: "price",      label: "Precio" },
  { key: "originalPrice",      label: "Precio original" },
  { key: "currency",      label: "Moneda" },
  { key: "exchangeRate",      label: "Tipo de cambio" },
  { key: "supplier",      label: "Proveedor" },
  { key: "transactionDate",      label: "Fecha de movimiento" },
];