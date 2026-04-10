import { useEffect, useState } from "react";
import { Product } from "@/types/product.type";
import ProductService from "@/service/product.service";

export function useProducts(initialLimit = 10) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(initialLimit);
  const [totalRecords, setTotalRecords] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async (
    page = currentPage,
    search = searchTerm,
    limit = recordsPerPage
  ) => {
    setIsLoading(true);
    try {
      const data = await ProductService.getPaginated(page, limit, search );
      setProducts(data.data);
      setTotalRecords(data.pagination.total ?? 1);
      setCurrentPage(data.pagination.page ?? 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    fetchData(1, value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData(page);
  };

  const handleLimitChange = (e: { target: { value: number } }) => {
    const newLimit = e.target.value;
    setRecordsPerPage(newLimit);
    setCurrentPage(1);
    fetchData(1, searchTerm, newLimit);
  };

  const handleSave = () => {
    fetchData();
    setShowForm(false);
  };

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  return {
    products,
    isLoading,
    searchTerm,
    currentPage,
    recordsPerPage,
    totalRecords,
    showForm,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    handleSave,
    openForm,
    closeForm,
  };
}
