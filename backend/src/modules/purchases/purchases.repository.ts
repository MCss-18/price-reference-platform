import { format } from "date-fns";
import { IDatabaseConnection } from "../../core/database/connection.interface";
import { IPurchasesRepository } from "./interface/purchases-repository.interface";
import { Purchases } from "./interface/purchases.interface";

export class PurchasesRespository implements IPurchasesRepository{

  // private mapRowTopPurchases(row: any): Purchases {
  //   return {
  //     productCode: row.Cd_Prod,
  //     description: row.Descrip,

  //     highest: {
  //       price: row.highestPrice,
  //       transactionDate: row.highestDate,
  //       supplier: row.highestSupplier,
  //     },

  //     lowest: {
  //       price: row.lowestPrice,
  //       transactionDate: row.lowestDate,
  //       supplier: row.lowestSupplier,
  //     },

  //     mostRecent: {
  //       price: row.mostRecentPrice,
  //       transactionDate: row.mostRecentDate,
  //       supplier: row.mostRecentSupplier,
  //     },
  //   };
  // }

  // async findByProductCode(
  //   conn: IDatabaseConnection,
  //   productCode: string,
  //   startDate: string,
  //   endDate: string,
  // ): Promise<Purchases | null> {

  //   const baseWhere = `
  //     FROM CompraDet2 d
  //     INNER JOIN Compra2 c ON d.Cd_Com = c.Cd_Com
  //     WHERE c.RucE = '20117322751' AND d.Cd_Prod = $1
  //       AND c.FecMov BETWEEN $2 AND $3
  //   `;

  //   const highestQuery = `
  //     SELECT TOP 1
  //       d.Cd_Prod, d.Descrip,
  //       d.ValorUni  AS highestPrice,
  //       c.FecMov    AS highestDate,
  //       c.Proveedor AS highestSupplier
  //     ${baseWhere}
  //     ORDER BY d.ValorUni DESC, c.FecMov DESC
  //   `;

  //   const lowestQuery = `
  //     SELECT TOP 1
  //       d.ValorUni  AS lowestPrice,
  //       c.FecMov    AS lowestDate,
  //       c.Proveedor AS lowestSupplier
  //     ${baseWhere}
  //     ORDER BY d.ValorUni ASC, c.FecMov DESC
  //   `;

  //   const mostRecentQuery = `
  //     SELECT TOP 1
  //       d.ValorUni  AS mostRecentPrice,
  //       c.FecMov    AS mostRecentDate,
  //       c.Proveedor AS mostRecentSupplier
  //     ${baseWhere}
  //     ORDER BY c.FecMov DESC, d.ValorUni DESC
  //   `;

  //   const params = [productCode, startDate, endDate];

  //   const [highestRows, lowestRows, mostRecentRows] = await Promise.all([
  //     conn.query(highestQuery, params),
  //     conn.query(lowestQuery, params),
  //     conn.query(mostRecentQuery, params),
  //   ]);

  //   if (!highestRows.length && !lowestRows.length && !mostRecentRows.length) {
  //     return null;
  //   }

  //   const highest = highestRows[0];
  //   const lowest  = lowestRows[0];
  //   const recent  = mostRecentRows[0];

  //   return {
  //     productCode: highest?.Cd_Prod   ?? productCode,
  //     description: highest?.Descrip   ?? "",
  //     highest: {
  //       price:           highest?.highestPrice    ?? null,
  //       transactionDate: highest?.highestDate     ?? null,
  //       supplier:        highest?.highestSupplier ?? null,
  //     },
  //     lowest: {
  //       price:           lowest?.lowestPrice    ?? null,
  //       transactionDate: lowest?.lowestDate     ?? null,
  //       supplier:        lowest?.lowestSupplier ?? null,
  //     },
  //     mostRecent: {
  //       price:           recent?.mostRecentPrice    ?? null,
  //       transactionDate: recent?.mostRecentDate     ?? null,
  //       supplier:        recent?.mostRecentSupplier ?? null,
  //     },
  //   };
  // }

  async findByProductCode(
    conn: IDatabaseConnection,
    productCode: string,
    startDate: string,
    endDate: string,
  ): Promise<Purchases | null> {

    const query = `
      SELECT 
        d.Cd_Prod,
        p.CodCo1_,
        d.Descrip,
        d.PrecioUni AS originalPrice,
        CASE 
          WHEN c.Cd_Mda = '02' THEN d.PrecioUni * c.CamMda
          ELSE d.PrecioUni
        END AS price,
        c.Cd_Mda AS currency,
        c.CamMda AS exchangeRate,
        c.FecMov AS transactionDate,
        c.Proveedor AS supplier
      FROM CompraDet2 d
      INNER JOIN Compra2 c ON d.Cd_Com = c.Cd_Com
      INNER JOIN Producto2 p ON d.Cd_Prod = p.Cd_Prod
      WHERE 
        c.RucE = '20117322751'
        AND d.Cd_Prod = $1
        AND c.FecMov >= $2
        AND c.FecMov < $3
      ORDER BY c.FecMov DESC
    `;

    const rows = await conn.query(query, [productCode, startDate, endDate]);
    
    if (!rows.length) return null;
    return this.buildPurchases(rows);
  }

  private buildPurchases(rows: any[]): Purchases {
    const first = rows[0];
    if (rows.length === 1) {
      const single = {
        price: first.price,
        originalPrice: first.originalPrice,
        currency: first.currency,
        exchangeRate: first.exchangeRate,
        transactionDate: format(new Date(first.transactionDate), "dd-MM-yyyy"),
        supplier: first.supplier,
      };
      return {
        productCode: first.Cd_Prod,
        productCode2: first.CodCo1_,
        description: first.Descrip,
        highest: single,
        lowest: single,
        mostRecent: single,
      };
    }
    
    const mapRow = (row: any) => ({
      price: row.price,
      originalPrice: row.originalPrice,
      currency: row.currency,
      exchangeRate: row.exchangeRate,
      transactionDate: format(new Date(row.transactionDate), "dd-MM-yyyy"),
      supplier: row.supplier,
    });
    const highest = rows.reduce((a, b) => a.price > b.price ? a : b);
    const lowest = rows.reduce((a, b) => a.price < b.price ? a : b);
    const mostRecent = rows[0];
    return {
      productCode: first.Cd_Prod,
      productCode2: first.CodCo1_,
      description: first.Descrip,
      highest: mapRow(highest),
      lowest: mapRow(lowest),
      mostRecent: mapRow(mostRecent),
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