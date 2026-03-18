import { PoolClient } from "pg";
import { IDatabaseConnection } from "../../core/database/connection.interface";

export class PostgresConnectionAdapter implements IDatabaseConnection {
  constructor(private readonly client: PoolClient) {}

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this.client.query(sql, params);
    return result.rows as T[];
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const result = await this.client.query(sql, params);
    return result.rows[0] || null;
  }

  async execute(sql: string, params?: any[]): Promise<{ rowsAffected: number }> {
    const result = await this.client.query(sql, params);
    return { rowsAffected: result.rowCount || 0 };
  }

  // Metodo interno para acceder al client cuando necesites release
  getClient(): PoolClient {
    return this.client;
  }
}