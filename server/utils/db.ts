import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "MaRTaHGui60$",
  database: "mta2",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql: string, params: any[] = []): Promise<any> {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export default pool;
