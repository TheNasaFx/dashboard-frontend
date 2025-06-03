// import { Pool } from "pg";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// export default defineEventHandler(async (event) => {
//   const client = await pool.connect();
//   try {
//     const { rows } = await client.query("SELECT * FROM users");
//     return rows;
//   } finally {
//     client.release();
//   }
// });
