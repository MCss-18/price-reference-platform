import { Router } from "express";
import { productController } from "./product.module";

const productRoutes = Router();

productRoutes.get("/", productController.findPaginatedAndCount);

export default productRoutes;