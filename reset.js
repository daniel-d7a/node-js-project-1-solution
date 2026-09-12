import fs from "fs/promises";
import path from "path";

const dbPath = path.join(import.meta.dirname, "data.json");

const emptyDb = {
  auth_users: [],
  products: [],
  carts: [],
  orders: [],
};

const intervalMinutes = parseInt(process.argv[2]) || 0;

async function resetAndSeed() {
  await fs.writeFile(dbPath, JSON.stringify(emptyDb, null, 2));
  console.log("Database reset.");

  await import("./seed.js");
}

resetAndSeed();

if (intervalMinutes > 0) {
  const ms = intervalMinutes * 60 * 1000;
  console.log(`Will reset and re-seed every ${intervalMinutes} minute(s).`);

  setInterval(async () => {
    console.log("\n--- Scheduled reset ---");
    await resetAndSeed();
  }, ms);
}
