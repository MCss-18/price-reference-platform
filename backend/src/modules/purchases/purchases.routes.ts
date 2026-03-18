import { Router } from "express";
import { purchasesController } from "./purchases.module";

const purchasesRoutes = Router();

purchasesRoutes.get("/:productCode", purchasesController.findByProductCode);

export default purchasesRoutes;