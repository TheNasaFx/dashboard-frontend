import { setupDatabase } from "../server/utils/setup-db.js";

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
