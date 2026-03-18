import { IDatabaseConnection } from "../../../core/database/connection.interface";
import { IBaseRepository } from "../../../core/repository/base-repository.interface";
import { Purchases } from "./purchases.interface";

export interface IPurchasesRepository extends IBaseRepository<Purchases>{

  findByProductCode(
    conn: IDatabaseConnection,
    productCode: string,
    startDate: string,
    endDate: string,
  ): Promise<Purchases | null>;

}