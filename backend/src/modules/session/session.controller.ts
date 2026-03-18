import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { SessionService } from "./session.service";
import { HTTPSTATUS } from "../../config/http.config";
import { NotFoundException } from "../../common/utils/catch-errors";

export class SessionController {

  private readonly sessionService: SessionService;

  constructor(sessionService: SessionService) {
    this.sessionService = sessionService;
  }

  public findAllSessionsActive = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number((req as any).user?.userId);
    const sessionId = this.parseSessionId((req as any).sessionId);
    if (!userId) {
      throw new NotFoundException("User ID not found. Please log in.");
    }
    const sessions = await this.sessionService.findAllSessionsActive(userId);
    const modifySessions = sessions.map((session) => ({
      ...session,
      ...(session.sessionId === sessionId && {
        isCurrent: true,
      }),
    }));
    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Sesiones obtenidas exitosamente",
      data: modifySessions,
    });
  });

  public findById = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = this.parseSessionId((req as any).sessionId);
    const session = await this.sessionService.findById(sessionId);
    if (!session) {
      throw new NotFoundException("Session not found. Please log in again.");
    }
    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Sesiones obtenidas exitosamente",
      user: session.user,
    });
  });

  public deleteById = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = this.parseSessionId(req.params.sessionId as string);

    await this.sessionService.deleteById(Number(sessionId));
    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Sesión eliminada exitosamente",
    });
  });

  private parseSessionId(sessionIdParam: string): number {
    const sessionId = Number(sessionIdParam);
    
    if (!sessionId || Number.isNaN(sessionId) || sessionId <= 0) {
      throw new NotFoundException("Session ID not found. Please log in.");
    }
    
    return sessionId;
  }

}