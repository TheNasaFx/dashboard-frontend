import { defineEventHandler } from "h3";
import { query } from "../../utils/db"; // Adjust path as needed

export default defineEventHandler(async (event) => {
  try {
    // TODO: Add authentication/authorization check if this endpoint should be protected
    // await requireAuth(event); // Example using a hypothetical auth middleware function

    // Fetch recent registration records
    // Adjust the SQL query and columns based on your DB schema and original PHP logic (e.g., customer table)
    const sql =
      "SELECT id, name as taxpayerName, registration_date as registrationDate, invoice_number as invoiceNumber, report_number as reportNumber FROM customer ORDER BY registration_date DESC LIMIT 10"; // Example query
    const recentRecords = await query(sql, []);

    // TODO: Format data if necessary

    return recentRecords;
  } catch (error) {
    console.error("API Error fetching recent registrations:", error);
    // Return an error response
    event.res.statusCode = 500; // Internal Server Error
    return { error: "Failed to fetch recent registrations." };
  }
});
