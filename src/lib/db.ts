// lib/db.js
import sql from 'mssql'
import dotenv from 'dotenv';
dotenv.config();


let pool: sql.ConnectionPool;

const config: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'localhost',
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

export async function getConnection(): Promise<sql.ConnectionPool> {
    if (!pool) {
        if (!config.user || !config.password || !config.database) {
            throw new Error('Missing database credentials in environment variables.');
        }

        pool = await sql.connect(config);
    }

    return pool;
}