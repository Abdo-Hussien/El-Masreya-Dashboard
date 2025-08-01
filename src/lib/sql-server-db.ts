// lib/db.js
import dotenv from 'dotenv';
import sql from 'mssql';
import odbc from 'odbc';

dotenv.config();


let pool: sql.ConnectionPool;

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  pool: {
    max: 10, // Max concurrent connections
    min: 0, // Minimum maintained connections
    idleTimeoutMillis: 30000, // Close idle connections after 30s
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const odbcParams: odbc.ConnectionParameters = { connectionString: 'DSN=Masria_V26', connectionTimeout: 20000 }

async function getODBC(): Promise<odbc.Connection> {
  return await odbc.connect(odbcParams);
}

async function getConnection(): Promise<sql.ConnectionPool> {
  console.log("Config: ", config)
  if (!config.user || !config.password || !config.database) throw new Error('Missing database credentials in environment variables.');
  if (!pool || !pool.connected) pool = await sql.connect(config);

  return pool;
}

export {
  getConnection,
  getODBC
};

