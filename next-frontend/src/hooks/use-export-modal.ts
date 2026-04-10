import { useState, useCallback } from "react";
import { exportToExcel, ColumnConfig } from "@/utils/exportToExcel";
import { toast } from "sonner";

interface UseExportModalProps<T> {
  data: T[];
  fileName: string;
  columns: ColumnConfig<T>[];
  isLoadingData?: boolean;
}

export function useExportModal<T extends object>({
  data,
  fileName,
  columns,
  isLoadingData = false,
}: UseExportModalProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  // Columnas visibles al usuario (las no excluidas)
  const visibleColumns = columns.filter((col) => !col.excluded);

  // Estado de selección por columna
  const [selectedKeys, setSelectedKeys] = useState<Set<keyof T>>(
    () => new Set(visibleColumns.map((c) => c.key))
  );

  const allSelected = selectedKeys.size === visibleColumns.length;

  const toggleColumn = useCallback((key: keyof T) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedKeys(
      allSelected
        ? new Set()
        : new Set(visibleColumns.map((c) => c.key))
    );
  }, [allSelected, visibleColumns]);

  const handleExport = useCallback(() => {
    if (isLoadingData) {
      toast.loading("Descargando datos...");
      return;
    }
    try {
      const selectedColumns = columns.filter(
        (col) => !col.excluded && selectedKeys.has(col.key)
      );
      exportToExcel(data, fileName, selectedColumns);
      toast.success("Datos exportados exitosamente, revise sus Descargas");
      setIsOpen(false);
    } catch {
      toast.error("Ocurrió un error al exportar los datos");
    }
  }, [isLoadingData, data, fileName, columns, selectedKeys]);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    visibleColumns,
    selectedKeys,
    allSelected,
    toggleColumn,
    toggleAll,
    handleExport,
  };
}