import { HTTPSTATUS } from "../../config/http.config";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { Request, Response } from "express";
import { ServiceService } from "./service.service";

export class ServiceController {

  private readonly serviceService: ServiceService;
  
  constructor(serviceService: ServiceService) {
    this.serviceService = serviceService;
  }

  public findPaginatedAndCount = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const search = (req.query.search as string) || '';
    const offset = (page - 1) * limit;

    const { data, total } = await this.serviceService.findPaginatedAndCount(
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