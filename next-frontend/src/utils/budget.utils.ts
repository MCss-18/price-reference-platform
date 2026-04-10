export const PRICE_TYPE_LABELS: Record<"highest" | "lowest" | "mostRecent", string> = {
  highest: "Precio más alto",
  lowest: "Precio más bajo",
  mostRecent: "Precio más reciente",
};

export function getPriceTypeLabel(type: string): string {
  return PRICE_TYPE_LABELS[type as keyof typeof PRICE_TYPE_LABELS] ?? "-";
}

export function getCurrencyLabel(currency: string): string {
  return currency === "02" ? "USD" : "PEN";
}