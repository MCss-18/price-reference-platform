import { FileDown, X } from "lucide-react";
import { ColumnConfig } from "@/utils/exportToExcel";
import { Button } from "./button";

interface ModalExportProps<T> {
  readonly title?: string;
  readonly visibleColumns: ColumnConfig<T>[];
  readonly selectedKeys: Set<keyof T>;
  readonly allSelected: boolean;
  readonly onToggleColumn: (key: keyof T) => void;
  readonly onToggleAll: () => void;
  readonly onExport: () => void;
  readonly onClose: () => void;
  readonly isLoadingData?: boolean;
}

export function ModalExport<T>({
  title = "Exportar Excel",
  visibleColumns,
  selectedKeys,
  allSelected,
  onToggleColumn,
  onToggleAll,
  onExport,
  onClose,
  isLoadingData = false,
}: ModalExportProps<T>) {
  return (
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        Selecciona las columnas que deseas incluir en la exportación.
      </p>

      <label className="flex items-center gap-3 font-medium cursor-pointer border-b pb-3">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onToggleAll}
          className="h-4 w-4 accent-primary"
        />
        Exportar todo
      </label>

      {/* Lista de columnas */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
        {visibleColumns.map((col) => (
          <label
            key={String(col.key)}
            className="flex items-center gap-3 cursor-pointer text-sm"
          >
            <input
              type="checkbox"
              checked={selectedKeys.has(col.key)}
              onChange={() => onToggleColumn(col.key)}
              className="h-4 w-4 accent-primary"
            />
            {col.label}
          </label>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={onExport}
          disabled={selectedKeys.size === 0 || isLoadingData}
        >
          <FileDown className="mr-2 h-4 w-4" />
          {isLoadingData ? "Cargando datos..." : "Exportar"}
        </Button>
      </div>
    </div>
  );
}