import { PaginatedResponse } from "@/core/api-response";
import API from "@/lib/api/axios-client";
import { PRODUCT_ENDPOINTS } from "@/lib/api/endpoints";
import { Product } from "@/types/product.type";

export const ProductService = {

  getPaginated : async (page: number, limit: number, search: string) => {
    const { data } = await API.get<PaginatedResponse<Product>>(PRODUCT_ENDPOINTS.PAGINATED(page, limit, search))
    return data;
  },

}

export default ProductService;