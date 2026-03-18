export interface PriceDetail {
  price: number;
  transactionDate: string;
  supplier: string;
}

export interface Purchases {
  productCode: string;
  description: string;

  highest: PriceDetail;
  lowest: PriceDetail;
  mostRecent: PriceDetail;
}