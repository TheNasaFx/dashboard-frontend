import { defineEventHandler } from "h3";
import { query } from "../../utils/db"; // Adjust path as needed

export default defineEventHandler(async (event) => {
  try {
    // TODO: Add authentication/authorization check

    // Fetch data for the activities chart (e.g., counts by activity type)
    // Example: Count customers by their activity type (adjust table and column names as needed)
    const sql = `
      SELECT
        activity_type as label,
        COUNT(*) as count
      FROM customer // Or your relevant table
      GROUP BY activity_type
      ORDER BY count DESC;
    `; // Example query
    const activitiesData = await query(sql, []);

    // TODO: Format the data to fit the chart requirements
    // For a donut chart, ApexCharts expects data series (counts) and labels.
    // You will need to process `activitiesData` to extract counts and labels into separate arrays.

    return activitiesData;
  } catch (error) {
    console.error("API Error fetching activities data:", error);
    event.res.statusCode = 500; // Internal Server Error
    return { error: "Failed to fetch activities data." };
  }
});
