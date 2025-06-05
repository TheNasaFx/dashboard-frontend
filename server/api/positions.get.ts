import mysql from "mysql2/promise";
import { defineEventHandler } from "h3";
// Nuxt 3 runtime config composable
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const connection = await mysql.createConnection({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
  });

  try {
    const [rows] = await connection.execute("SELECT * FROM positions");
    return rows;
  } catch (error: any) {
    return { error: "Database error", details: error.message };
  } finally {
    await connection.end();
  }
});
