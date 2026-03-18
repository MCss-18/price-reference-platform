import { Request } from "express";
import { User as CustomUser } from "../common/interface/user.interface";

declare global {
  namespace Express {
    interface User extends CustomUser {}
    interface Request extends ExpressRequest{
      userId?: string;
      sessionId?: string;
    }
  }
}

export {};