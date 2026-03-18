import { PurchasesController } from "./purchases.controller";
import { PurchasesService } from "./purchases.service";

const purchasesService = new PurchasesService();
const purchasesController = new PurchasesController(purchasesService);

export { purchasesService, purchasesController };