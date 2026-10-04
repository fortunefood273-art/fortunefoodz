const { PrismaClient } = require('@prisma/client');
const google = require('googlethis');

const prisma = new PrismaClient();

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateImages() {
  const products = await prisma.product.findMany();
  let updated = 0;

  for (const product of products) {
    try {
      // Search for high quality image
      const query = `${product.name} ${product.category !== 'Uncategorized' ? product.category : ''} high quality food photography -vector -illustration`;
      console.log(`Searching for: ${query}`);
      
      const images = await google.image(query, { safe: true, additional_params: { tbs: 'isz:l' } }); // isz:l means large images
      
      if (images && images.length > 0) {
        // Filter out bad domains if necessary, but we'll just take the first working-looking one
        let newImg = null;
        for (const img of images) {
            if (img.url.startsWith('http') && !img.url.includes('svg')) {
                newImg = img.url;
                break;
            }
        }
        
        if (newImg) {
          await prisma.product.update({
            where: { id: product.id },
            data: { img: newImg, images: newImg }
          });
          console.log(`Updated ${product.name} -> ${newImg}`);
          updated++;
        }
      }
      
      // Delay to avoid Google rate limit
      await delay(1500);
    } catch (err) {
      console.error(`Failed to update ${product.name}: ${err.message}`);
    }
  }

  console.log(`Finished updating ${updated} product images successfully.`);
}

updateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
