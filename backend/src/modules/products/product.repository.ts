import { IDatabaseConnection } from "../../core/database/connection.interface";
import { IProductRepository } from "./interface/product-repository.interface";
import { Product } from "./interface/product.interface";

export class ProductRepository implements IProductRepository{

  private mapRowToProduct(row: any): Product {
    return {
      productCode: row.Cd_Prod,
      productCode2: row.CodCo1_,
      description: row.Nombre1,
      state: row.Estado,
    };
  }
  
  async create(data: Product, conn: IDatabaseConnection): Promise<void | number> {
    throw new Error("Method not implemented.");
  }
  
  async update(id: number, data: Product, conn: IDatabaseConnection): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findAll(_conn: IDatabaseConnection): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  
  async findPaginatedAndCount(params: { search: string; limit: number; offset: number; }, conn: IDatabaseConnection): Promise<{ data: Product[]; total: number; }> {
    const { search, limit, offset } = params;
    const dataQuery = `
      SELECT 
        Cd_Prod,
        CodCo1_,
        Nombre1,
        Estado
      FROM Producto2
      WHERE 
        RucE = '20117322751' AND (
        Cd_Prod LIKE $1 
        OR CodCo1_ LIKE $1 
        OR LOWER(Nombre1) LIKE LOWER($1) )
      ORDER BY Cd_Prod ASC
      OFFSET $2 ROWS FETCH NEXT $3 ROWS ONLY
    `;
    
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM Producto2
      WHERE 
      RucE = '20117322751' AND (Cd_Prod LIKE $1 OR Nombre1 LIKE $1)
    `;
    
    const searchValue = `%${search}%`
    const [dataRows, countRows] = await Promise.all([
      conn.query(dataQuery, [searchValue, offset, limit]),
      conn.query(countQuery, [searchValue])
    ]);
    
    const data = dataRows.map(this.mapRowToProduct);
    const total = Number(countRows[0].total);

    return { data, total };
  }
}