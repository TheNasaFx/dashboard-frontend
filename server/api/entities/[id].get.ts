import { defineEventHandler, getRouterParam } from "h3";
import { query } from "../../utils/db"; // Adjust path if necessary

export default defineEventHandler(async (event) => {
  const entityId = getRouterParam(event, "id");

  if (!entityId) {
    event.res.statusCode = 400; // Bad Request
    return { error: "Entity ID is required" };
  }

  try {
    // Fetch entity data by ID
    // Adjust the SQL query and columns based on your DB schema (e.g., 'entities' table)
    // Including fields used in the frontend template like name, type, address, image, phone, email, description, lat, lng
    const sql =
      "SELECT id, name, type, status, address, image, phone, email, description, lat, lng FROM entities WHERE id = ?"; // Example query
    const results = await query(sql, [entityId]);

    if (results.length > 0) {
      // Assuming the first result is the entity
      const entity = results[0];

      // TODO: Fetch actual chart data from DB and format it
      // Adding placeholder chart data for demonstration
      entity.lineChartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Revenue",
            backgroundColor: "#f87979",
            data: [40, 20, 12, 39, 10, 40, 39],
          },
        ],
      };
      entity.doughnutChartData = {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [
          {
            label: "Dataset 1",
            data: [300, 50, 100],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
            ],
          },
        ],
      };
      entity.barChartData = {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          {
            label: "Sales",
            backgroundColor: "#42A5F5",
            data: [50, 60, 70, 80],
          },
        ],
      };
      entity.polarAreaChartData = {
        labels: ["Red", "Green", "Yellow", "Grey", "Blue"],
        datasets: [
          {
            label: "Dataset 1",
            data: [11, 16, 7, 3, 14],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(75, 192, 192)",
              "rgb(255, 205, 86)",
              "rgb(201, 203, 207)",
              "rgb(54, 162, 235)",
            ],
          },
        ],
      };
      entity.pieChartData = {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [
          {
            label: "Dataset 1",
            data: [300, 50, 100],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
            ],
          },
        ],
      };
      entity.radarChartData = {
        labels: [
          "Eating",
          "Drinking",
          "Sleeping",
          "Designing",
          "Coding",
          "Cycling",
          "Running",
        ],
        datasets: [
          {
            label: "My First Dataset",
            data: [65, 59, 90, 81, 56, 55, 40],
            fill: true,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgb(255, 99, 132)",
            pointBackgroundColor: "rgb(255, 99, 132)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(255, 99, 132)",
          },
        ],
      };

      return entity; // Return the entity object with chart data
    } else {
      event.res.statusCode = 404; // Not Found
      return { error: "Entity not found" };
    }
  } catch (error) {
    console.error("Database error fetching entity:", error);
    event.res.statusCode = 500; // Internal Server Error
    return { error: "Failed to fetch entity data" };
  }
});
