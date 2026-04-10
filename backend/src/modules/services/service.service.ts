import { BaseService } from "../../core/service/base.service";
import { SqlServerConnectionProvider } from "../../database/sqlserver/sqlserver-connection-provider";
import { Service } from "./interface/service.interface";
import { ServiceRepository } from "./service.repository";

export class ServiceService extends BaseService<
    Service
  > {

  protected repository = new ServiceRepository();
  protected connectionProvider = new SqlServerConnectionProvider();

}