import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

async function setupDatabase() {
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

async function main() {
  console.log("Starting database setup...");
  const success = await setupDatabase();

  if (success) {
    console.log("Database setup completed successfully");
    process.exit(0);
  } else {
    console.error("Database setup failed");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
