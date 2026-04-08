import sql, { config as SqlConfig, ConnectionPool } from 'mssql';

const config: SqlConfig = {
  user: process.env.DB_USER_MS ?? '',
  password: process.env.DB_PASS_MS ?? '',
  database: process.env.DB_NAME_MS ?? '',
  server: process.env.DB_HOST_MS ?? '',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    requestTimeout: 90000,
    connectTimeout: 30000,
  },
};

let pool: ConnectionPool | null = null;

export const getConnection = async (): Promise<ConnectionPool> => {
  try {
    if (!pool) {
      pool = await new sql.ConnectionPool(config).connect();
      console.log('######################### SQL Server connection established #########################');
    }
    return pool;
  } catch (err) {
    console.error('Error connecting to SQL Server:', err);
    throw err;
  }
};

getConnection().catch(err => console.error('Initial connection failure: ', err));

export { pool };