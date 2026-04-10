"use client"
import { ChevronDown, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import InputWithIcon from "./inputWithIcon";

interface DropdownSelectProps {
  readonly label: string;
  readonly name: string;
  readonly value: string | number | boolean;
  readonly options: { id: string | number | boolean; label: string }[];
  readonly handleChange: (e: { target: { name: string; value: string | number | boolean } }) => void;
}

function DropdownSelect({ label, name, value, options, handleChange }: DropdownSelectProps) {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selected, setSelected] = useState<{ id: string | number | boolean; label: string } | null>(
    options.find(opt => opt.id === value) || null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && overlayRef.current) {
      const rect = overlayRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    setFilteredOptions(options);
    setSelected(options.find(opt => opt.id === value) || null);
  }, [value, options]);

  const handleSelect = (option: { id: string | number | boolean; label: string }) => {
    event?.stopPropagation();
    
    setSelected(option);
    setIsOpen(false);
    setSearchTerm("");
    setFilteredOptions(options);
    handleChange({ target: { name, value: option.id } });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = options.filter(opt =>
      opt.label.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const overlayNode = overlayRef.current;
      const dropdownNode = dropdownRef.current;
      
      if (
        overlayNode &&
        !overlayNode.contains(event.target as Node) &&
        dropdownNode &&
        !dropdownNode.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setFilteredOptions(options);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside, true);
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, options]);

  useEffect(() => {
    return () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };
  }, []);

  return (
    <div ref={overlayRef} className="relative w-full max-w-[360px]">
      <button
        type="button"
        onClick={handleButtonClick}
        className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex justify-between items-center"
      >
        <span className="truncate">{selected ? selected.label : label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && ReactDOM.createPortal(
        <div 
          ref={dropdownRef}
          onClick={handleDropdownClick}
          className="absolute z-[99999] mt-2 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-md"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            position: "fixed",
            pointerEvents: "auto",
          }}
        >
          <div className="p-2">
            <InputWithIcon
              icon={Search}
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={String(option.id)} // Convertir a string
                  className="cursor-pointer px-4 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="py-2 px-4 text-sm text-muted-foreground text-center">
                No hay resultados
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default DropdownSelect;