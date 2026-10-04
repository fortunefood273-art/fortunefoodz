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
    let keyword = 'food';
    const cat = product.category.toLowerCase();
    const name = product.name.toLowerCase();

    // Map to specific visually accurate keywords
    if (cat.includes('seeds')) keyword = 'seeds';
    else if (name.includes('kaju') || name.includes('cashew')) keyword = 'cashew';
    else if (name.includes('badam') || name.includes('almond')) keyword = 'almond';
    else if (name.includes('pista')) keyword = 'pistachio';
    else if (cat.includes('dry fruit') || cat.includes('berries')) keyword = 'driedfruit';
    else if (cat.includes('sharbat') || cat.includes('beverage') || name.includes('syrup') || name.includes('crush')) keyword = 'beverage,drink';
    else if (cat.includes('spice') || name.includes('methi') || name.includes('saffron') || name.includes('cardamom')) keyword = 'spices';
    else if (name.includes('makhana')) keyword = 'snack';
    else if (cat.includes('chocolate') || name.includes('chocolate')) keyword = 'chocolate';
    else if (name.includes('murmura') || name.includes('puffs')) keyword = 'snack';
    else if (cat.includes('sweet') || name.includes('candy') || name.includes('gulkand')) keyword = 'sweets';
    else if (cat.includes('mukhwas')) keyword = 'fennel';
    else if (cat.includes('ghee') || name.includes('oil')) keyword = 'cooking,oil';
    else keyword = 'grocery';

    const newImg = `https://loremflickr.com/400/400/${keyword}?lock=${product.id}`;

    if (product.img !== newImg) {
      await prisma.product.update({
        where: { id: product.id },
        data: { img: newImg, images: JSON.stringify([newImg]) }
      });
      updated++;
      console.log(`Updated ${product.name} to ${keyword} (lock=${product.id})`);
    }
  }

  console.log(`Updated ${updated} product images successfully using LoremFlickr.`);
}

updateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
