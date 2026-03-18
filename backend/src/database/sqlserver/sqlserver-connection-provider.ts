import { getConnection } from "./sqlserver.database";
import { SqlServerConnectionAdapter } from "./sqlserver-connection.adapter";
import { IConnectionProvider } from "../../core/database/connection-provider.interface";
import { IDatabaseConnection } from "../../core/database/connection.interface";

export class SqlServerConnectionProvider implements IConnectionProvider {
  async getConnection(): Promise<IDatabaseConnection> {
    const pool = await getConnection();
    return new SqlServerConnectionAdapter(pool);
  }

  async releaseConnection(conn: IDatabaseConnection): Promise<void> {
    // SQL Server con ConnectionPool no requiere release manual
    // El pool maneja las conexiones automáticamente
  }
}