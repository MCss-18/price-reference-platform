import { Plus, Search, FileDown } from "lucide-react";
import InputWithIcon from "./ui/inputWithIcon";
import { Button } from "./ui/button";
import SelectLimitFilter from "./ui/SelectLimitFilter";

type ColumnOption = {
  key: string
  label: string
}

interface ExtraButton {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "outline" | "default" | "ghost" | "destructive";
}

interface ControlSectionProps {
  searchTerm?: string;
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  showFilter?: boolean;
  recordsPerPage?: number;
  onRecordsPerPageChange?: (e: { target: { value: number } }) => void;

  canCreate?: boolean;
  onCreate?: () => void;
  createLabel?: string;

  onDownload?: () => void;

  showColumnSelector?: boolean;
  availableColumns?: Array<ColumnOption>;
  visibleColumnKeys?: string[];
  onToggleColumn?: (columnKey: string) => void;
  extraButtons?: ExtraButton[];
}

const ControlSection: React.FC<ControlSectionProps> = ({
  searchTerm = "",
  onSearch,
  showFilter = false,
  recordsPerPage,
  onRecordsPerPageChange,
  canCreate = false,
  onCreate,
  createLabel = "Crear",
  onDownload,
  extraButtons = [],
}) => {

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start md:flex md:items-center md:justify-between mb-4">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
        {showFilter && recordsPerPage !== undefined && onRecordsPerPageChange && (
          <SelectLimitFilter
            recordsPerPage={recordsPerPage}
            handleRecordsPerPageChange={onRecordsPerPageChange}
          />
        )}
        <InputWithIcon
          icon={Search}
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={onSearch}
          className="w-full sm:w-64"
        />

      </div>

      <div className="flex gap-2 justify-start sm:justify-end w-full">
        {extraButtons.map((btn, i) => (
          <Button key={i} variant={btn.variant ?? "outline"} onClick={btn.onClick}>
            {btn.icon && <span className="mr-2">{btn.icon}</span>}
            {btn.label}
          </Button>
        ))}
        {onDownload && (
          <Button variant="outline" onClick={onDownload}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        )}

        {canCreate && onCreate && (
          <Button onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" />
            {createLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ControlSection;