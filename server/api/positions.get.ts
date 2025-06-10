import mysql from "mysql2/promise";
import { defineEventHandler, getQuery } from "h3";
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

  // Query параметрүүдийг авах
  const query = getQuery(event);
  const where: string[] = [];
  const params: any[] = [];

  if (query.district) {
    where.push("district = ?");
    params.push(query.district);
  }
  if (query.khoroo) {
    where.push("khoroo = ?");
    params.push(query.khoroo);
  }
  if (query.category) {
    where.push("category = ?");
    params.push(query.category);
  }

  let sql = "SELECT * FROM positions";
  if (where.length > 0) {
    sql += " WHERE " + where.join(" AND ");
  }

  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } catch (error: any) {
    return { error: "Database error", details: error.message };
  } finally {
    await connection.end();
  }
});
