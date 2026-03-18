import { SessionRepository } from "./session.repository";
import { PostgresConnectionProvider } from "../../database/postgres/postgres-connection.provider";
import { BaseService } from "../../core/service/base.service";
import { Session } from "./interface/session.interface";
import { CreateSessionDTO } from "./dto/create-session.dto";
import { User } from "../user/interface/user.interface";

export class SessionService extends BaseService<
    Session,
    CreateSessionDTO
  > {

  protected repository = new SessionRepository();
  protected connectionProvider = new PostgresConnectionProvider();
 
  public async findById(
    id: number
  ): Promise<{sessionId: number, expiredAt: string | Date, userId: number, user: Partial<User>} | null> {
    return this.withConnection(async (conn) => {
      return this.repository.findById(conn, id);
    });
  }

  public async findAllSessionsActive(
    userId: number
  ): Promise<Session[]> {
    return this.withConnection(async (conn) => {
      return this.repository.findAllSessionsActive(conn, userId);
    });
  }

  public async updateSessionExpiredAt(
    sessionId: number,
    expiredAt: string
  ): Promise<void> {
    return this.withConnection(async (conn) => {
      return this.repository.updateSessionExpiredAt(conn, sessionId, expiredAt);
    });
  }

  public async deleteById(
    id: number
  ): Promise<void> {
    return this.withConnection(async (conn) => {
      return this.repository.deleteById(conn, id);
    });
  }

}