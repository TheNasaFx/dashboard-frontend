import { defineEventHandler } from "h3";
import { query } from "../../../server/utils/db"; // Adjust path as needed

export default defineEventHandler(async (event) => {
  try {
    // TODO: Add authentication/authorization check if this endpoint should be protected
    // await requireAuth(event); // Example using a hypothetical auth middleware function

    // Fetch users data
    // Adjust the SQL query and columns based on your DB schema ('users' table)
    // Assuming inspectors have a specific role or a flag, e.g., role = 'inspector'
    const sql =
      "SELECT user_id as id, name, email, phone, last_login, status FROM users WHERE role = 'inspector'"; // Example query - adjust column name and filter condition as needed
    const users = await query(sql, []);

    // TODO: Format data if necessary (e.g., format last_login date, map status to display text)

    return users;
  } catch (error) {
    console.error("API Error fetching users data:", error);
    // Return an error response
    event.res.statusCode = 500; // Internal Server Error
    return { error: "Failed to fetch users." };
  }
});
