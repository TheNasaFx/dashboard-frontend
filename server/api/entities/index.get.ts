import { defineEventHandler } from "h3";
import { query } from "../../../server/utils/db"; // Adjust path as needed

export default defineEventHandler(async (event) => {
  try {
    // TODO: Add authentication/authorization check if this endpoint should be protected
    // await requireAuth(event); // Example using a hypothetical auth middleware function

    // Fetch list of entities
    // Adjust the SQL query and columns based on your DB schema (e.g., 'entities' table)
    const sql = "SELECT id, name, type, status FROM entities"; // Example query - adjust column names and table as needed
    const entities = await query(sql, []);

    // TODO: Format data if necessary (e.g., map status or type to display text)

    return entities;
  } catch (error) {
    console.error("API Error fetching entities data:", error);
    // Return an error response
    event.res.statusCode = 500; // Internal Server Error
    return { error: "Failed to fetch entities." };
  }
});
