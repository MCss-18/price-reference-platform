import { IDatabaseConnection } from "../../core/database/connection.interface";
import { User } from "../user/interface/user.interface";
import { CreateSessionDTO } from "./dto/create-session.dto";
import { ISessionRepository } from "./interface/session-repository.interface";
import { Session } from "./interface/session.interface";

export class SessionRepository implements ISessionRepository{
  
  private mapRowToSession(row: any): Session {
    return {
      sessionId: row.id_sesion,
      userId: row.usuario_id,
      userAgent: JSON.parse(row.user_agent),
      expiredAt: row.expira_en?.toISOString(), 
      createdAt: row.fecha_creacion?.toISOString(),
    };
  }

  async findById(conn: IDatabaseConnection, id: number): Promise<{sessionId: number, expiredAt: string|Date, userId: number, user: Partial<User>} | null> {
    const query = `
      SELECT 
        s.id_sesion,
        s.expira_en,
        s.usuario_id,
        r.id_rol,
        r.rol,
        u.id_usuario,
        u.nombres,
        u.apellidos,
        u.usuario,
        u.correo,
        u.estado
      FROM core.sesion s
        JOIN core.usuario u ON s.usuario_id = u.id_usuario
        JOIN core.usuario_rol ur ON ur.usuario_id = u.id_usuario
        JOIN core.rol r ON r.id_rol = ur.rol_id AND r.sistema_id = s.sistema_id
        JOIN core.sistema si ON r.sistema_id = si.id_sistema
      WHERE si.estado = true AND u.estado = true AND s.id_sesion = $1;
    `;
    const rows = await conn.query(query, [id]);
    if (rows.length === 0) {
      throw new Error('Session not found');
    }
    const session = rows[0];
    return {
      sessionId: session.id_sesion,
      expiredAt: session.expira_en,
      userId: session.usuario_id,
      user: {
        userId: session.id_usuario,
        names: session.nombres,
        surnames: session.apellidos,
        username: session.usuario,
        email: session.correo,
        rolId: session.id_rol,
        state: session.estado,
      }
    };
  }
  
  async findAllSessionsActive(conn: IDatabaseConnection, userId: number): Promise<Session[]> {
    const query = `
      SELECT 
        id_sesion,
        usuario_id,
        sistema_id,
        user_agent,
        expira_en,
        fecha_creacion
      FROM core.sesion
      WHERE sistema_id = $1 
        AND usuario_id = $2 
        AND expira_en > NOW()
      ORDER BY fecha_creacion DESC;
    `;
    const rows = await conn.query(query, [1, userId]);
    return rows.map(this.mapRowToSession);
  }
  
  async updateSessionExpiredAt(conn: IDatabaseConnection, sessionId: number, expiredAt: string): Promise<void> {
    const query = `
      UPDATE core.sesion SET expira_en = $1
      WHERE id_sesion = $2
    `;

    const values = [ expiredAt, sessionId ];
    await conn.query(query, values);
  }

  async deleteById(conn: IDatabaseConnection, sessionId: number): Promise<void> {
    const query = `
      DELETE FROM core.sesion WHERE id_sesion = $1
    `;

    await conn.query(query, [sessionId]);
  }
  
  async create(data: CreateSessionDTO, conn: IDatabaseConnection): Promise<void | number> {
    const { userId, userAgent, expiredAt } = data;
    const query = `
      INSERT INTO core.sesion (usuario_id, sistema_id, user_agent, expira_en)
      VALUES ($1, $2, $3, $4)
      RETURNING id_sesion
    `;
    const values = [ userId, 1, JSON.stringify(userAgent), expiredAt];
    const rows = await conn.query(query, values);
    const sessionId = rows[0]?.id_sesion;
    return sessionId;
  }
  
  update(_id: number, _data: Partial<Session>, _conn: IDatabaseConnection): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findAll(_conn: IDatabaseConnection): Promise<Session[]> {
    throw new Error("Method not implemented.");
  }
  findPaginatedAndCount(_params: { search: string; limit: number; offset: number; }, _conn: IDatabaseConnection): Promise<{ data: Session[]; total: number; }> {
    throw new Error("Method not implemented.");
  }

}
