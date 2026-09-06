require('dotenv').config();
const { createClient } = require('@libsql/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const { PrismaClient } = require('@prisma/client');

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});
const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

async function updateImages() {
  const products = await prisma.product.findMany();
  let updated = 0;

  for (const product of products) {
    const keyword = encodeURIComponent(`${product.name} ${product.category !== 'Uncategorized' ? product.category : 'food'} high quality product photography`);
    const newImg = `https://image.pollinations.ai/prompt/${keyword}?width=400&height=400&nologo=true&seed=${product.id}`;
    
    if (newImg !== product.img) {
      // Use raw sql because JSON string issues with adapter sometimes
      await prisma.product.update({
        where: { id: product.id },
        data: { img: newImg, images: JSON.stringify([newImg]) }
      });
      updated++;
      console.log(`Updated ${product.name}`);
    }
  }

  console.log(`Updated ${updated} product images successfully on Turso.`);
}

updateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
