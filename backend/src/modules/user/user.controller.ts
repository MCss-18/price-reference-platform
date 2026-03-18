import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { UserService } from "./user.service";
import { HTTPSTATUS } from "../../config/http.config";
import { NotFoundException } from "../../common/utils/catch-errors";

export class UserController {

  private readonly userService: UserService;
  
  constructor(userService: UserService) {
    this.userService = userService;
  }
 
  public findById = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Usuario obtenido exitosamente",
      data: user
    });
  });
}