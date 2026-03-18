import { ConnectionPool } from 'mssql';
import { IDatabaseConnection } from "../../core/database/connection.interface";

export class SqlServerConnectionAdapter implements IDatabaseConnection {
  constructor(private pool: ConnectionPool) {}

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const request = this.pool.request();
    
    // Bind parameters si existen
    if (params) {
      params.forEach((param, index) => {
        request.input(`param${index}`, param);
      });
      // Reemplaza $1, $2... con @param0, @param1...
      sql = sql.replace(/\$(\d+)/g, (_, num) => `@param${parseInt(num) - 1}`);
    }

    const result = await request.query(sql);
    return result.recordset as T[];
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results[0] || null;
  }

  async execute(sql: string, params?: any[]): Promise<{ rowsAffected: number }> {
    const request = this.pool.request();
    
    if (params) {
      params.forEach((param, index) => {
        request.input(`param${index}`, param);
      });
      sql = sql.replace(/\$(\d+)/g, (_, num) => `@param${parseInt(num) - 1}`);
    }

    const result = await request.query(sql);
    return { rowsAffected: result.rowsAffected[0] || 0 };
  }

  getPool(): ConnectionPool {
    return this.pool;
  }
}