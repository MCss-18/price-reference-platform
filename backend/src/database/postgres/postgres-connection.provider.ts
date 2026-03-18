import { pool } from "./postgres.database";
import { PostgresConnectionAdapter } from "./postgres-connection.adapter";
import { IConnectionProvider } from "../../core/database/connection-provider.interface";
import { IDatabaseConnection } from "../../core/database/connection.interface";

export class PostgresConnectionProvider implements IConnectionProvider {
  async getConnection(): Promise<IDatabaseConnection> {
    const client = await pool.connect();
    return new PostgresConnectionAdapter(client);
  }

  async releaseConnection(conn: IDatabaseConnection): Promise<void> {
    const adapter = conn as PostgresConnectionAdapter;
    adapter.getClient().release();
  }
}