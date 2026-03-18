import { IDatabaseConnection } from "./connection.interface";

export interface IConnectionProvider {
  getConnection(): Promise<IDatabaseConnection>;
  releaseConnection(conn: IDatabaseConnection): Promise<void>;
}