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
  ): Promise<Purchases | null> {

    const baseWhere = `
      FROM CompraDet2 d
      INNER JOIN Compra2 c ON d.Cd_Com = c.Cd_Com
      WHERE c.RucE = '20117322751' AND d.Cd_Prod = $1
        AND c.FecMov BETWEEN $2 AND $3
    `;

    const highestQuery = `
      SELECT TOP 1
        d.Cd_Prod, d.Descrip,
        d.ValorUni  AS highestPrice,
        c.FecMov    AS highestDate,
        c.Proveedor AS highestSupplier
      ${baseWhere}
      ORDER BY d.ValorUni DESC, c.FecMov DESC
    `;

    const lowestQuery = `
      SELECT TOP 1
        d.ValorUni  AS lowestPrice,
        c.FecMov    AS lowestDate,
        c.Proveedor AS lowestSupplier
      ${baseWhere}
      ORDER BY d.ValorUni ASC, c.FecMov DESC
    `;

    const mostRecentQuery = `
      SELECT TOP 1
        d.ValorUni  AS mostRecentPrice,
        c.FecMov    AS mostRecentDate,
        c.Proveedor AS mostRecentSupplier
      ${baseWhere}
      ORDER BY c.FecMov DESC, d.ValorUni DESC
    `;

    const params = [productCode, startDate, endDate];

    const [highestRows, lowestRows, mostRecentRows] = await Promise.all([
      conn.query(highestQuery, params),
      conn.query(lowestQuery, params),
      conn.query(mostRecentQuery, params),
    ]);

    // Si no hay ningún resultado, retorna null
    if (!highestRows.length && !lowestRows.length && !mostRecentRows.length) {
      return null;
    }

    const highest = highestRows[0];
    const lowest  = lowestRows[0];
    const recent  = mostRecentRows[0];

    return {
      productCode: highest?.Cd_Prod   ?? productCode,
      description: highest?.Descrip   ?? "",
      highest: {
        price:           highest?.highestPrice    ?? null,
        transactionDate: highest?.highestDate     ?? null,
        supplier:        highest?.highestSupplier ?? null,
      },
      lowest: {
        price:           lowest?.lowestPrice    ?? null,
        transactionDate: lowest?.lowestDate     ?? null,
        supplier:        lowest?.lowestSupplier ?? null,
      },
      mostRecent: {
        price:           recent?.mostRecentPrice    ?? null,
        transactionDate: recent?.mostRecentDate     ?? null,
        supplier:        recent?.mostRecentSupplier ?? null,
      },
    };
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