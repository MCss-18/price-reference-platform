"use client";
import Pagination from "@/components/ui/Pagination";
import ControlSection from "@/components/control-section";
import { useBudgetList } from "@/hooks/useBudgetList";
import { useExportModal } from "@/hooks/use-export-modal";
import { PRODUCT_EXPORT_COLUMNS } from "@/components/features/products/product.columns";
import { ModalExport } from "@/components/ui/ModalExport";
import ProductTable from "@/components/features/budge/tables/ListProductTable";
import { Trash } from "lucide-react";

function BudgetPage() {
  const {
    items, 
    isLoading, 
    searchTerm, 
    currentPage,
    recordsPerPage, 
    totalRecords,
    handleSearch, 
    handlePageChange, 
    clear,
    allItems
  } = useBudgetList();

  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const exportModal = useExportModal({
    data: allItems,
    fileName: "lista-presupuesto.xlsx",
    columns: PRODUCT_EXPORT_COLUMNS,
    isLoadingData: isLoading,
  });

  return (
    <section>
      <ControlSection
        searchTerm={searchTerm}
        onSearch={handleSearch}
        showFilter
        recordsPerPage={recordsPerPage}
        onDownload={exportModal.open}
        extraButtons={[
          {
            label: "Limpiar lista",
            icon: <Trash className="h-4 w-4" />,
            onClick: () => clear(),
            variant: "destructive",
          },
        ]}
      />
      <div className="body-section">
        <div className="container-table">
          <ProductTable
            products={items}
            isLoading={isLoading}
          />
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
          {items.length > 0 && (
            <p className="text-xs text-gray-400 mt-3">
              * Los precios están expresados en soles (PEN). Las compras en dólares fueron convertidas
              al tipo de cambio de la fecha. Incluyen IGV.
            </p>
          )}
        </div>
      </div>
      {exportModal.isOpen && (
        <div className="overlay">
          <ModalExport
            title="Exportar presupuesto"
            visibleColumns={exportModal.visibleColumns}
            selectedKeys={exportModal.selectedKeys}
            allSelected={exportModal.allSelected}
            onToggleColumn={exportModal.toggleColumn}
            onToggleAll={exportModal.toggleAll}
            onExport={exportModal.handleExport}
            onClose={exportModal.close}
            isLoadingData={isLoading}
          />
        </div>
      )}
    </section>
  );
}

export default BudgetPage;