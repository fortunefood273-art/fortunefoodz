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
    let type = '';
    const cat = product.category.toLowerCase();
    if (cat.includes('seeds')) type = 'healthy raw seeds bowl';
    else if (cat.includes('dry fruit')) type = 'premium dry fruits and nuts bowl';
    else if (cat.includes('sharbat') || cat.includes('beverage')) type = 'glass bottle of premium beverage drink';
    else if (cat.includes('spice')) type = 'raw authentic indian spices';
    else if (cat.includes('chocolate') || cat.includes('sweet')) type = 'premium sweets and chocolates';
    else if (cat.includes('makhana') || cat.includes('snack')) type = 'crunchy roasted healthy snack bowl';
    
    // Construct a highly detailed prompt to get a specific and realistic product image
    const prompt = `Professional e-commerce product photography of ${product.name}, ${type}, single product focus, front view, well-lit studio lighting, isolated on a clean soft neutral background, 8k resolution, highly detailed realistic food photography, appetizing`;
    const keyword = encodeURIComponent(prompt);
    
    const newImg = `https://image.pollinations.ai/prompt/${keyword}?width=400&height=400&nologo=true&seed=${product.id}`;
    
    if (newImg !== product.img) {
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

updateImages().catch(console.error).finally(() => prisma.$disconnect());
