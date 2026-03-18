import { SqlServerConnectionProvider } from "../../database/sqlserver/sqlserver-connection-provider";
import { BaseService } from "../../core/service/base.service";
import { Purchases } from "./interface/purchases.interface";
import { PurchasesRespository } from "./purchases.repository";

export class PurchasesService extends BaseService<Purchases>{

  protected repository = new PurchasesRespository();
  protected connectionProvider = new SqlServerConnectionProvider();

  public async findByProductCode(
    productCode: string,
    startDate: string,
    endDate: string,
  ): Promise<Purchases | null> {
    return this.withConnection(async (conn) => {
      return this.repository.findByProductCode(conn, productCode, startDate, endDate);
    });
  }

}