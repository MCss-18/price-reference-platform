import { FC } from "react";
import { ActionButton } from "@/components/ui/actionButton";
import Table, { TableColumn } from "@/components/ui/Table";
import { BudgetItem } from "@/types/BudgetItem.type";
import { useBudgetList } from "@/hooks/useBudgetList";
import { formatWithCommas } from "@/utils/formatWithCommas";
import { getCurrencyLabel } from "@/utils/budget.utils";

const columns: TableColumn<BudgetItem>[] = [
  { key: "productCode2", label: "Codigo", sortable: true, filterable: true } ,
  { key: "description", label: "Producto", sortable: true, filterable: true},
  { key: "selectedType", label: "Tipo", sortable: true, filterable: true },
  { key: "price", label: "Precio", sortable: true, filterable: true 
    ,
    render: (_, row) => 
    <div className="font-semibold text-gray-800">
      S/{ formatWithCommas(row.price)}
      {row.currency === "02" && (
        <div className="text-xs text-gray-500">
          ({getCurrencyLabel(row.currency)} {formatWithCommas(row.originalPrice)} | TC: {formatWithCommas(row.exchangeRate)})
        </div>
      )}
    </div>
  },
  { key: "supplier", label: "Proveedor", sortable: true, filterable: true },
  { key: "transactionDate", label: "Fecha Mov.", sortable: true, filterable: true },
];

const ProductTable: FC<{ products: BudgetItem[]; isLoading: boolean; onSave?: () => void }> = ({ products, isLoading }) => {
  
  const {
      removeItem, 
    } = useBudgetList();
  return (
    <>
      <Table<BudgetItem>
        columns={columns}
        data={products}
        isLoading={isLoading}
        actionButton={(product) => (
          <div className='flex gap-2'>
            <ActionButton onClick={() => removeItem(product.productCode)} type="delete" />
          </div>
        )}
      />
    </>
  );
};
export default ProductTable