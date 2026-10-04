require('dotenv').config();
const { createClient } = require('@libsql/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const { PrismaClient } = require('@prisma/client');
const libsql = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

// Run: ALTER TABLE User ADD COLUMN wishlist TEXT;
async function migrate() {
  try {
    await libsql.execute('ALTER TABLE User ADD COLUMN wishlist TEXT');
    console.log('Column added to Turso DB successfully.');
  } catch (e) {
    if (e.message.includes('duplicate column')) {
      console.log('Column already exists, skipping.');
    } else {
      console.error(e.message);
    }
  }
  process.exit(0);
}
migrate();
