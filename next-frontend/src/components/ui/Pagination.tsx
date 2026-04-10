"use client"

import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [pageInput, setPageInput] = useState(currentPage);

  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);

  const handlePageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value > 0 && value <= totalPages) {
      setPageInput(value);
    }
  };

  const handlePageSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (pageInput > 0 && pageInput <= totalPages) {
      onPageChange(pageInput);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      <Button 
        onClick={handlePrevious} 
        disabled={currentPage === 1}
        className="disabled:opacity-50"
      >
        Anterior
      </Button>
      <form onSubmit={handlePageSubmit} className="flex items-center gap-2">
        <Input
          type="number"
          value={pageInput}
          onChange={handlePageInput}
          min="1"
          max={totalPages}
        />
        <Button 
          type="submit"
        >
            Ir
        </Button>
      </form>
      <Button 
        onClick={handleNext} 
        disabled={currentPage === totalPages}
      >
        Siguiente
      </Button>
    </div>
  );
};

export default Pagination;
