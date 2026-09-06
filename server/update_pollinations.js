const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateImages() {
  const products = await prisma.product.findMany();
  let updated = 0;

  for (const product of products) {
    const keyword = encodeURIComponent(`${product.name} ${product.category !== 'Uncategorized' ? product.category : 'food'} high quality product photography`);
    const newImg = `https://image.pollinations.ai/prompt/${keyword}?width=400&height=400&nologo=true&seed=${product.id}`;
    
    if (newImg !== product.img) {
      await prisma.product.update({
        where: { id: product.id },
        data: { img: newImg, images: newImg }
      });
      updated++;
      console.log(`Updated ${product.name}`);
    }
  }

  console.log(`Updated ${updated} product images successfully.`);
}

updateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
