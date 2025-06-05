import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

export async function setupDatabase() {
  try {
    // Get the absolute path to the SQL file
    const sqlFilePath = path.resolve(process.cwd(), "mta2.sql");

    // Check if the file exists
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error("SQL file not found");
    }

    // Create database if it doesn't exist
    await execAsync('mysql -u root -e "CREATE DATABASE IF NOT EXISTS mta2"');

    // Import the SQL file
    await execAsync(`mysql -u root mta2 < "${sqlFilePath}"`);

    console.log("Database setup completed successfully");
    return true;
  } catch (error) {
    console.error("Error setting up database:", error);
    return false;
  }
}
