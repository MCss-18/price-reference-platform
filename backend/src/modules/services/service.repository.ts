import { IDatabaseConnection } from "../../core/database/connection.interface";
import { IServiceRepository } from "./interface/service-repository.interface";
import { Service } from "./interface/service.interface";

export class ServiceRepository implements IServiceRepository{
  
  private mapRowToService(row: any): Service {
    return {
      serviceCode: row.Cd_Srv,
      serviceCode2: row.CodCo,
      description: row.Nombre,
    };
  }
  
  create(data: Partial<Service>, conn: IDatabaseConnection): Promise<void | number> {
    throw new Error("Method not implemented.");
  }
  update(id: number, data: Partial<Service>, conn: IDatabaseConnection): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findAll(conn: IDatabaseConnection): Promise<Service[]> {
    throw new Error("Method not implemented.");
  }
  
  async findPaginatedAndCount(params: { search: string; limit: number; offset: number; }, conn: IDatabaseConnection): Promise<{ data: Service[]; total: number; }> {
    const { search, limit, offset } = params;
    const dataQuery = `
      SELECT 
        Cd_Srv,
        CodCo,
        Nombre
      FROM Servicio2
      WHERE 
        RucE = '20117322751' AND (
        Cd_Srv LIKE $1 
        OR CodCo LIKE $1 
        OR LOWER(Nombre) LIKE LOWER($1) )
      ORDER BY Cd_Srv ASC
      OFFSET $2 ROWS FETCH NEXT $3 ROWS ONLY
    `;
    
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM Servicio2
      WHERE 
      RucE = '20117322751' AND (Cd_Srv LIKE $1 OR Nombre LIKE $1)
    `;
    
    const searchValue = `%${search}%`
    const [dataRows, countRows] = await Promise.all([
      conn.query(dataQuery, [searchValue, offset, limit]),
      conn.query(countQuery, [searchValue])
    ]);
    
    const data = dataRows.map(this.mapRowToService);
    const total = Number(countRows[0].total);

    return { data, total };
  }
  
}