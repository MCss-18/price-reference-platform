import { Pool } from 'pg';
import { config } from "../../config/app.config";

const dbSettings = {
  host: config.DB.DB_HOST,
  database: config.DB.DB_DATABASE,
  user: config.DB.DB_USER,
  password: config.DB.DB_PASSWORD,
  port: Number(config.DB.DB_PORT),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
};

const pool = new Pool(dbSettings);

pool.connect()
  .then(client => {
    console.log('PostgreSQL Connection Successful');
    client.release();
  })
  .catch(err => {
    console.error('PostgreSQL Connection Failed:', err);
  });

export { pool };