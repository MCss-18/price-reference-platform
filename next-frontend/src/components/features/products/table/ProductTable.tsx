import { FC, useState } from "react";
import { Product } from "@/types/product.type";
import { ActionButton } from "@/components/ui/actionButton";
import Table, { TableColumn } from "@/components/ui/Table";
import PurchasesModal from "../modal/PurchasesModal";

const columns: TableColumn<Product>[] = [
  { key: "productCode", label: "CODIGO", sortable: true, filterable: true },
  { key: "productCode2", label: "CODIGO", sortable: true, filterable: true },
  { key: "description", label: "DESCRIPCION", sortable: true, filterable: true },
];

const ProductTable: FC<{ products: Product[]; isLoading: boolean; onSave?: () => void }> = ({ products, isLoading }) => {
  
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  const openModal = (client: Product) => {
    setSelectedProduct(client);
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false)
    setSelectedProduct(undefined); 
  };

  return (
    <>
      <Table<Product>
        columns={columns}
        data={products}
        isLoading={isLoading}
        actionButton={(product) => (
          <div className='flex gap-2'>
            <ActionButton onClick={() => openModal(product)} type="view" />
          </div>
        )}
      />
      {showForm && selectedProduct && (
        <div className="overlay" >
          <PurchasesModal
            closeForm={closeModal} 
            productCode={selectedProduct?.productCode}
          />
        </div>
      )}
    </>
  );
};
export default ProductTable