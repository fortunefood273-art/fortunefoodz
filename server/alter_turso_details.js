require('dotenv').config();
const { createClient } = require('@libsql/client');

async function main() {
  const libsql = createClient({
    url: process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    await libsql.execute(`ALTER TABLE "Product" ADD COLUMN details TEXT;`);
    console.log("details column added successfully!");
  } catch (error) {
    if (error.message.includes('duplicate column')) {
      console.log("details column already exists.");
    } else {
      console.error("Error altering table:", error);
    }
  }
}
main();
