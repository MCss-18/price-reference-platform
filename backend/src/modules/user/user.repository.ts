import { format } from "date-fns";
import { User} from "./interface/user.interface";
import { IUserRepository } from "./interface/user-repository.interface";
import { IDatabaseConnection } from "../../core/database/connection.interface";

export class UserRepository implements IUserRepository {

  private mapRowToUser(row: any): User {
    return {
      userId: row.id_usuario,
      names: row.nombres,
      surnames: row.apellidos,
      username: row.usuario,
      email: row.correo ?? "",
      rolId: row.id_rol,
      rolUser: row.rol,
      state: row.estado,
      createdAt: row.fecha_creacion
        ? format(new Date(row.fecha_creacion), "dd-MM-yyyy")
        : "Fecha no disponible",
      modifiedAt: row.fecha_modificacion
        ? format(new Date(row.fecha_modificacion), "dd-MM-yyyy")
        : "Fecha no disponible",
    };
  }

  async findById(conn: IDatabaseConnection, id: number): Promise<User | null> {
    const query = `
       SELECT
          u.id_usuario,
          u.nombres,
          u.apellidos,
          u.usuario,
          u.correo,
          u.clave,
          u.estado,
          u.fecha_creacion,
          u.fecha_modificacion,
          r.id_rol,
          r.rol
        FROM core.usuario u
        JOIN core.usuario_rol ur ON u.id_usuario = ur.usuario_id
        JOIN core.rol r ON ur.rol_id = r.id_rol
        JOIN core.sistema s ON r.sistema_id = s.id_sistema
        WHERE s.estado = true AND u.estado = true AND u.id_usuario = $1
          AND r.sistema_id = $2
    `;

    const rows = await conn.query(query, [id, 4])
    return rows[0] ? this.mapRowToUser(rows[0]) : null;
  }
 
  async findByUsername(conn: IDatabaseConnection, username: string, excludeUserId?: number): Promise<User| null> {
    const queryParts = [
      `
        SELECT
          u.id_usuario,
          u.nombres,
          u.apellidos,
          u.usuario,
          u.correo,
          u.clave,
          u.estado,
          u.fecha_creacion,
          u.fecha_modificacion,
          r.id_rol,
          r.rol
        FROM core.usuario u
        JOIN core.usuario_rol ur ON u.id_usuario = ur.usuario_id
        JOIN core.rol r ON ur.rol_id = r.id_rol
        JOIN core.sistema s ON r.sistema_id = s.id_sistema
        WHERE s.estado = true AND u.estado = true AND u.usuario = $1
          AND r.sistema_id = $2
      `
    ];
    const values: (string | number)[] = [username, 4];
    if (excludeUserId !== undefined) {
      queryParts.push(`AND id_usuario != $2`);
      values.push(excludeUserId);
    }
    const rows = await conn.query(queryParts.join("\n"), values);
    if (rows.length === 0) return null;
    const row = rows[0];
    
    return {
      userId: row.id_usuario,
      names: row.nombres,
      surnames: row.apellidos,
      username: row.usuario,
      email: row.correo,
      rolId: row.id_rol,
      rolUser: row.rol,
      password: row.clave,
      state: row.estado,
      createdAt: row.fecha_creacion
        ? format(new Date(row.fecha_creacion), "dd-MM-yyyy")
        : "Fecha no disponible",
      modifiedAt: row.fecha_modificacion
        ? format(new Date(row.fecha_modificacion), "dd-MM-yyyy")
        : "Fecha no disponible",
    }
  }

  async create(data: User, conn: IDatabaseConnection): Promise<number> {
    throw new Error("Method not implemented.");
  }

  async update(id: number, data: User, conn: IDatabaseConnection): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findAll(conn: IDatabaseConnection): Promise<User[]> {
    throw new Error("Method not implemented.");
  }

  async findAllByStateUserAndSystem(conn: IDatabaseConnection, stateUser = false): Promise<User[]> {
    throw new Error("Method not implemented.");
  }

  async findPaginatedAndCount(params: { search: string; limit: number; offset: number; }, conn: IDatabaseConnection): Promise<{ data: User[]; total: number; }> {
    throw new Error("Method not implemented.");
  }
}  

