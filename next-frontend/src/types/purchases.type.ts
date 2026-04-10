export type PriceDetail = {
  price: number; // ya en PEN
  originalPrice: number; // precio original
  currency: string;  // '01' | '02'
  exchangeRate: number;
  transactionDate: string;
  supplier: string;
}

export type Purchases = {
  productCode: string;
  productCode2: string;
  description: string;

  highest: PriceDetail;
  lowest: PriceDetail;
  mostRecent: PriceDetail;
}