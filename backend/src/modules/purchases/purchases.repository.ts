import { IDatabaseConnection } from "../../core/database/connection.interface";
import { IPurchasesRepository } from "./interface/purchases-repository.interface";
import { Purchases } from "./interface/purchases.interface";

export class PurchasesRespository implements IPurchasesRepository{

  private mapRowTopPurchases(row: any): Purchases {
    return {
      productCode: row.Cd_Prod,
      description: row.Descrip,

      highest: {
        price: row.highestPrice,
        transactionDate: row.highestDate,
        supplier: row.highestSupplier,
      },

      lowest: {
        price: row.lowestPrice,
        transactionDate: row.lowestDate,
        supplier: row.lowestSupplier,
      },

      mostRecent: {
        price: row.mostRecentPrice,
        transactionDate: row.mostRecentDate,
        supplier: row.mostRecentSupplier,
      },
    };
  }

  async findByProductCode(
    conn: IDatabaseConnection,
    productCode: string,
    startDate: string,
    endDate: string,
  ) : Promise<Purchases | null> {
    const query = `
      WITH Datos AS (
        SELECT 
            d.Cd_Prod,
            d.Descrip,
            d.ValorUni,
            c.FecMov,
            c.Cd_Prv,
            c.Proveedor
        FROM CompraDet2 d
        INNER JOIN Compra2 c 
            ON d.Cd_Com = c.Cd_Com
        WHERE 
            c.RucE = '20117322751'
            d.Cd_Prod = $1
            AND c.FecMov BETWEEN $2 AND $3
      ),

      Maximo AS (
          SELECT TOP 1 *
          FROM Datos
          ORDER BY ValorUni DESC, FecMov DESC
      ),

      Minimo AS (
          SELECT TOP 1 *
          FROM Datos
          ORDER BY ValorUni ASC, FecMov DESC
      ),

      Ultimo AS (
          SELECT TOP 1 *
          FROM Datos
          ORDER BY FecMov DESC
      )

      SELECT 
          d.Cd_Prod,
          d.Descrip,

          maximo.ValorUni AS highestPrice,
          maximo.FecMov AS highestDate,
          maximo.Proveedor AS highestSupplier,

          minimo.ValorUni AS lowestPrice,
          minimo.FecMov AS lowestDate,
          minimo.Proveedor AS lowestSupplier,

          ultimo.ValorUni AS mostRecentPrice,
          ultimo.FecMov AS mostRecentDate,
          ultimo.Proveedor AS mostRecentSupplier

      FROM (SELECT TOP 1 Cd_Prod, Descrip FROM Datos) d
      CROSS JOIN Maximo maximo
      CROSS JOIN Minimo minimo
      CROSS JOIN Ultimo ultimo
    `;
    const rows = await conn.query(query, [productCode, startDate, endDate]);
    if (!rows.length) return null;
    return this.mapRowTopPurchases(rows[0]);
  }

  create(data: Partial<Purchases>, conn: IDatabaseConnection): Promise<void | number> {
    throw new Error("Method not implemented.");
  }
  update(id: number, data: Partial<Purchases>, conn: IDatabaseConnection): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findAll(conn: IDatabaseConnection): Promise<Purchases[]> {
    throw new Error("Method not implemented.");
  }
  findPaginatedAndCount(params: { search: string; limit: number; offset: number; }, conn: IDatabaseConnection): Promise<{ data: Purchases[]; total: number; }> {
    throw new Error("Method not implemented.");
  }
}