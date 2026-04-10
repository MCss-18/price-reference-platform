import { useEffect, useRef, useState } from "react";
import type {ReactNode} from "react";
import { ChevronsDownUp, Loader } from "lucide-react";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  className?: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, row: T) => ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading: boolean;
  actionButton?: (row: T) => ReactNode;
  onSort?: (columnKey: keyof T) => void; 
  sortColumn?: keyof T;
  sortOrder?: "asc" | "desc";
}

const Table = <T,>({ columns, data, isLoading, actionButton, onSort, sortColumn, sortOrder }: TableProps<T>) => {
  const [filterMenu, setFilterMenu] = useState<{ key: string | null; visible: boolean }>({ key: null, visible: false });
  const [filters, setFilters] = useState<{ [key: string]: Set<string> }>({});


  const toggleFilterMenu = (columnKey: string) => {
    setFilterMenu((prev) => ({
      key: prev.key === columnKey ? null : columnKey,
      visible: prev.key !== columnKey,
    }));
  };

  const handleSort = (columnKey: keyof T, order: "asc" | "desc") => {
    onSort?.(columnKey);
    setFilterMenu({ key: null, visible: false }); // Cerrar menu despues de ordenar
  };

  const handleFilterChange = (columnKey: string, value: string, checked: boolean) => {
    setFilters((prevFilters) => {
      const updatedFilters = new Set(prevFilters[columnKey] || []);
      if (checked) {
        updatedFilters.add(value);
      } else {
        updatedFilters.delete(value);
      }
      return { ...prevFilters, [columnKey]: updatedFilters };
    });
  };

  const applyFilters = (row: T) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key].size) return true; // Si no hay filtros aplicados en la columna, mostrar todas
      return filters[key].has(String(row[key as keyof T]));
    });
  };

  const filteredDataTable = data.filter(applyFilters);

  const overlayRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        setFilterMenu({ key: null, visible: false });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterMenu]);

  if (isLoading) {
    return (
      <div className="text-[var(--t-primary)] w-full h-full flex items-center justify-center">
        <Loader size="30px" className="loader-spin" />
        Cargando datos...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground overflow-x-auto shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left text-xs font-semibold uppercase text-muted-foreground">#</th>
            {columns.map((col) => (
              <th
                key={col.key as string}
                className={`p-3 text-left text-xs font-semibold uppercase text-muted-foreground relative ${col.sortable ? "cursor-pointer" : ""}`}
              >
                <div className="flex justify-between items-center">
                  <span onClick={() => col.sortable && onSort?.(col.key)}>
                    {col.label}
                  </span>
                  {col.filterable && (
                    <button
                      onClick={() => toggleFilterMenu(col.key as string)}
                      className="ml-2 p-1 rounded-md hover:bg-accent/50 transition"
                    >
                      <ChevronsDownUp size={16} />
                    </button>
                  )}
                </div>

                {/* Filtro desplegable */}
                {filterMenu.visible && filterMenu.key === col.key && (
                  <div
                    ref={overlayRef}
                    className="absolute top-full z-50 left-0 mt-2 w-60 bg-popover border border-border shadow-lg rounded-lg p-3 text-foreground"
                  >
                    <button
                      onClick={() => handleSort(col.key, "asc")}
                      className="w-full text-left p-2 text-sm rounded-md hover:bg-muted transition"
                    >
                      🔼 Ordenar de menor a mayor
                    </button>
                    <button
                      onClick={() => handleSort(col.key, "desc")}
                      className="w-full text-left p-2 text-sm rounded-md hover:bg-muted transition"
                    >
                      🔽 Ordenar de mayor a menor
                    </button>

                    <div className="border-t my-2" />

                    <div className="max-h-40 overflow-y-auto">
                      {Array.from(new Set(data.map((row) => String(row[col.key])))).map((value) => (
                        <label
                          key={value}
                          className="flex items-center space-x-2 p-1 text-sm hover:bg-muted rounded"
                        >
                          <input
                            type="checkbox"
                            checked={filters[col.key as string]?.has(value) || false}
                            onChange={(e) =>
                              handleFilterChange(col.key as string, value, e.target.checked)
                            }
                            className="accent-primary"
                          />
                          <span>{value}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </th>
            ))}
            {actionButton && (
              <th className="p-3 text-left text-xs font-semibold uppercase text-muted-foreground">
                Acciones
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {filteredDataTable.map((row, index) => (
            <tr
              key={index}
              className="border-b border-border hover:bg-accent/30 transition-colors"
            >
              <td className="p-3">{index + 1}</td>
              {columns.map((col) => (
                <td key={col.key as string} className={`p-3 ${col.className}`}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] as ReactNode)}
                </td>
              ))}
              {actionButton && <td className="p-3">{actionButton(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;