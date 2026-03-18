import { HTTPSTATUS } from "../../config/http.config";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { Request, Response } from "express";
import { PurchasesService } from "./purchases.service";
import { logger } from "../../common/utils/logger";
import { NotFoundException } from "../../common/utils/catch-errors";

export class PurchasesController {

  private readonly purchasesService: PurchasesService;
  
  constructor(PurchasesService: PurchasesService) {
    this.purchasesService = PurchasesService;
  }

  public findByProductCode = asyncHandler(async (req: Request, res: Response) => {
    const productCode = req.params.productCode as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    if (!productCode) {
      logger.error("productCode not found")
      throw new NotFoundException("Producto requerido");
    }

    if (!startDate || !endDate) {
      throw new NotFoundException("fecha inicio y fecha fin son requeridos");
    }

    const Purchases = await this.purchasesService.findByProductCode(productCode, startDate, endDate)
    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Datos obtenido exitosamente",
      data: Purchases
    });
  }) 

}