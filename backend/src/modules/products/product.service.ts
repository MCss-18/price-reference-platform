import { BaseService } from "../../core/service/base.service";
import { SqlServerConnectionProvider } from "../../database/sqlserver/sqlserver-connection-provider";
import { Product } from "./interface/product.interface";
import { ProductRepository } from "./product.repository";

export class ProductService extends BaseService<
    Product
  > {

  protected repository = new ProductRepository();
  protected connectionProvider = new SqlServerConnectionProvider();

}