require('dotenv').config();
const { createClient } = require('@libsql/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const { PrismaClient } = require('@prisma/client');
const https = require('https');

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});
const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      // Just wait for the headers, that means generation started/finished
      res.on('data', () => {});
      res.on('end', () => resolve(res.statusCode));
    }).on('error', () => resolve(500));
  });
}

async function warmup() {
  const products = await prisma.product.findMany({ select: { name: true, img: true } });
  const urls = products.filter(p => p.img && p.img.includes('pollinations'));
  console.log('Total URLs to warmup:', urls.length);
  
  let i = 0;
  const chunk = 20; // 20 concurrent
  while (i < urls.length) {
    const batch = urls.slice(i, i + chunk);
    console.log(`Processing batch ${i/chunk + 1}...`);
    await Promise.all(batch.map(p => {
      return fetchUrl(p.img).then(status => console.log(`Done: ${p.name} (${status})`));
    }));
    i += chunk;
  }
  console.log('Warmup complete!');
}

warmup().catch(console.error).finally(() => prisma.$disconnect());
