import React from "react";
import DropdownSelect from "./dropdownSelect";

interface SelectLimitFilterProps {
  recordsPerPage: number;
  handleRecordsPerPageChange: (event: { target: { value: number } }) => void;
}

const SelectLimitFilter: React.FC<SelectLimitFilterProps> = ({ recordsPerPage, handleRecordsPerPageChange }) => {
  const RECORDS_OPTIONS = [10, 100, 500, 1000, 5000, 15000];

  const options = RECORDS_OPTIONS.map(option => ({
    id: option,
    label: `${option} registros`,
  }));

  const handleChange = (e: { target: { name: string; value: string | number | boolean } }) => {
    handleRecordsPerPageChange({ target: { value: Number(e.target.value) } });
  };

  return (
    <DropdownSelect
      label="Seleccionar un límite"
      name="recordsPerPage"
      value={recordsPerPage}
      options={options}
      handleChange={handleChange}
    />
  );
}


export default SelectLimitFilter