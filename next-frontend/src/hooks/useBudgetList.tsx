"use client";
import { BudgetItem } from "@/types/BudgetItem.type";
import { useEffect, useState, useMemo } from "react";

const STORAGE_KEY = "budget_list";

export function useBudgetList(initialLimit = 10) {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setItems(stored ? JSON.parse(stored) : []);
    setIsLoading(false);
  }, []);

  const isInBudget = (productCode: string) =>
    items.some((i) => i.productCode === productCode);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(
      (i) =>
        i.description.toLowerCase().includes(term) ||
        i.productCode.toLowerCase().includes(term)
    );
  }, [searchTerm, items]);

  const totalRecords = filteredItems.length;

  const paginatedItems = useMemo(
    () => filteredItems.slice((currentPage - 1) * initialLimit, currentPage * initialLimit),
    [filteredItems, currentPage, initialLimit]
  );

  const addItem = (item: BudgetItem) => {
    setItems((prev) => {
      const updated = prev.some((i) => i.productCode === item.productCode)
        ? prev.map((i) => (i.productCode === item.productCode ? item : i))
        : [...prev, item];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (productCode: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.productCode !== productCode);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clear = () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return {
    addItem,
    items: paginatedItems,
    allItems: filteredItems,
    isLoading,
    searchTerm,
    currentPage,
    recordsPerPage: initialLimit,
    totalRecords,
    handleSearch,
    handlePageChange: setCurrentPage,
    removeItem,
    clear,
    isInBudget
  };
}