import { defineEventHandler } from "h3";
import { query } from "../../../server/utils/db"; // Adjust path as needed
import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // TODO: Add authentication/authorization check if this endpoint should be protected
    // await requireAuth(event); // Example using a hypothetical auth middleware function

    // Get filter parameters from query string (e.g., /api/map/positions?district=Bayan&khoroo=1)
    const queryParams = getQuery(event);
    const district: string | undefined = Array.isArray(queryParams.district)
      ? queryParams.district[0]
      : (queryParams.district as string | undefined);
    const khoroo: string | undefined = Array.isArray(queryParams.khoroo)
      ? queryParams.khoroo[0]
      : (queryParams.khoroo as string | undefined);
    const activityType: string | undefined = Array.isArray(
      queryParams.activityType
    )
      ? queryParams.activityType[0]
      : (queryParams.activityType as string | undefined);
    const type: string | undefined = Array.isArray(queryParams.type)
      ? queryParams.type[0]
      : (queryParams.type as string | undefined);

    // Build the WHERE clause based on filters
    let whereClause = "";
    const params: string[] = [];

    if (district !== undefined) {
      if (whereClause) whereClause += " AND";
      whereClause += " district = ?";
      params.push(district); // parameter should be string
    }
    if (khoroo !== undefined) {
      if (whereClause) whereClause += " AND";
      whereClause += " khoroo = ?";
      params.push(khoroo); // parameter should be string
    }
    // TODO: Add conditions for activityType and type filters based on your DB schema
    // Example for activityType:
    if (activityType !== undefined) {
      if (whereClause) whereClause += " AND";
      whereClause += " activity_type = ?"; // Adjust column name
      params.push(activityType);
    }
    // Example for type:
    if (type !== undefined) {
      if (whereClause) whereClause += " AND";
      whereClause += " type_column = ?"; // Adjust column name
      params.push(type);
    }

    // Fetch map positions data from the 'positions_org' table
    // Adjust the SQL query and columns based on your DB schema
    // Using 'street' as 'address' based on map.php logic
    let sql =
      "SELECT id, category, lat, lng, image, name, street as address FROM positions_org";
    if (whereClause) {
      sql += " WHERE" + whereClause;
    }

    const positions = await query(sql, params);

    // TODO: Format data if necessary (e.g., ensure lat/lng are numbers)
    const formattedPositions = positions
      .map((pos: any) => ({
        id: pos.id,
        category: pos.category,
        lat: parseFloat(pos.lat), // Ensure lat is a number
        lng: parseFloat(pos.lng), // Ensure lng is a number
        image: pos.image, // Assuming image path is stored directly
        name: pos.name,
        address: pos.address,
      }))
      .filter((pos: any) => !isNaN(pos.lat) && !isNaN(pos.lng)); // Filter out positions with invalid coordinates

    return formattedPositions;
  } catch (error) {
    console.error("API Error fetching map positions:", error);
    // Return an error response
    event.res.statusCode = 500; // Internal Server Error
    return { error: "Failed to fetch map positions." };
  }
});
