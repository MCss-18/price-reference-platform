"use client";

import Pagination from '@/components/ui/Pagination';
import ControlSection from '@/components/control-section';
import { useProducts } from '@/hooks/use-products';
import ProductTable from '@/components/features/products/table/ProductTable';

function ProductPage() {
  const {
    products,
    isLoading,
    searchTerm,
    currentPage,
    recordsPerPage,
    totalRecords,
    handleSearch,
    handlePageChange,
    handleSave,
  } = useProducts();

  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  return (
    <section>
      <ControlSection
        searchTerm={searchTerm}
        onSearch={handleSearch}
        showFilter
        
        recordsPerPage={recordsPerPage}
      />

      <div className="body-section">
        <div className="container-table">
          <ProductTable
            products={products}
            isLoading={isLoading}
            onSave={handleSave}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  );
}

export default ProductPage;
