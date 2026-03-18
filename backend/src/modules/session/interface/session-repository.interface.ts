import { IDatabaseConnection } from "../../../core/database/connection.interface";
import { IBaseRepository } from "../../../core/repository/base-repository.interface";
import { User } from "../../user/interface/user.interface";
import { CreateSessionDTO } from "../dto/create-session.dto";
import { Session } from "./session.interface";

export interface ISessionRepository extends IBaseRepository<
  Session, 
  CreateSessionDTO
>{

  findById(
    conn: IDatabaseConnection,
    id: number
  ): Promise<{sessionId: number, expiredAt: string|Date, userId: number, user: Partial<User>} | null>;

  findAllSessionsActive(
    conn: IDatabaseConnection,
    userId: number
  ): Promise<Session[]>;

  updateSessionExpiredAt(
    conn: IDatabaseConnection,
    sessionId: number, 
    expiredAt: string
  ): Promise<void>;

  deleteById(
    conn: IDatabaseConnection,
    id: number, 
  ): Promise<void>;
}