import { ApiSingleResponse } from "@/core/api-response";
import API from "@/lib/api/axios-client";
import { PURCHASES_ENDPOINTS } from "@/lib/api/endpoints";
import { Purchases } from "@/types/purchases.type";

export const PurchasesService = {

  getPrices : async (productCode: string, startDate: string, endDate: string) => {
    const { data } = await API.get<ApiSingleResponse<Purchases>>(PURCHASES_ENDPOINTS.PRICES_BY_PRODUCT(productCode, startDate, endDate))
    return data;
  },

}

export default PurchasesService;