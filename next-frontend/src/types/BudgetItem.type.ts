export type PriceType = "highest" | "lowest" | "mostRecent";

export type BudgetItem = {
  productCode: string;
  productCode2: string;
  description: string;
  selectedType: string;
  price: number;
  originalPrice: number;
  currency: string;
  exchangeRate: number;
  supplier: string;
  transactionDate: string;
};