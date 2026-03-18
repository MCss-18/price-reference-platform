import { HTTPSTATUS } from "../../config/http.config";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { Request, Response } from "express";
import { ProductService } from "./product.service";

export class ProductController {

  private readonly productService: ProductService;
  
  constructor(ProductService: ProductService) {
    this.productService = ProductService;
  }

  public findPaginatedAndCount = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const search = (req.query.search as string) || '';
    const offset = (page - 1) * limit;

    const { data, total } = await this.productService.findPaginatedAndCount(
      limit, 
      offset, 
      search
    );

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Datos obtenidos exitosamente",
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data
    });
  });

}