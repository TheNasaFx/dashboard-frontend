import { defineEventHandler } from "h3";
import { query } from "../../utils/db"; // Adjust path as needed

export default defineEventHandler(async (event) => {
  try {
    // TODO: Add authentication/authorization check

    // Fetch data for the reports chart
    // Example: Count registrations by month (adjust table and date column name as needed)
    const sql = `
      SELECT
        DATE_FORMAT(registration_date, '%Y-%m') as month,
        COUNT(*) as count
      FROM customer
      GROUP BY month
      ORDER BY month;
    `; // Example query
    const reportData = await query(sql, []);

    // TODO: Format the data to fit the chart requirements if necessary
    // ApexCharts expects data in a specific format (e.g., { series: [{ data: [...] }], labels: [...] })
    // You will need to process `reportData` to match this structure.

    return reportData;
  } catch (error) {
    console.error("API Error fetching reports data:", error);
    event.res.statusCode = 500; // Internal Server Error
    return { error: "Failed to fetch reports data." };
  }
});
