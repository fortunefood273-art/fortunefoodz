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

function searchWikiImage(query) {
  return new Promise((resolve) => {
    const safeQuery = encodeURIComponent(query);
    const options = {
      hostname: 'en.wikipedia.org',
      path: `/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=600&generator=search&gsrsearch=${safeQuery}&gsrlimit=3`,
      headers: { 'User-Agent': 'FortuneFoodApp/1.0 (test@example.com)' }
    };
    
    https.get(options, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.query && json.query.pages) {
            // Find first page with an original image
            const pages = Object.values(json.query.pages);
            const pageWithImg = pages.find(p => p.thumbnail && p.thumbnail.source);
            if (pageWithImg) {
              resolve(pageWithImg.thumbnail.source);
              return;
            }
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

const fallbacks = {
  seeds: [
    "https://images.unsplash.com/photo-1599320092708-8a9dde49fc2c?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80"
  ],
  dryfruit: [
    "https://images.unsplash.com/photo-1626697556426-8a55a8af4999?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1600189020840-e9918c25269d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1543158181-1274e5362710?auto=format&fit=crop&w=400&q=80"
  ],
  drink: [
    "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1618724980108-a4d3856fd8f5?auto=format&fit=crop&w=400&q=80"
  ],
  spice: [
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1606914469633-bd39206ea739?auto=format&fit=crop&w=400&q=80"
  ],
  snack: [
    "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1688217170693-e821c6e18d72?auto=format&fit=crop&w=400&q=80"
  ],
  general: [
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80"
  ]
};

function getFallback(product) {
  const cat = product.category.toLowerCase();
  const name = product.name.toLowerCase();
  let pool = fallbacks.general;
  if (cat.includes('seeds')) pool = fallbacks.seeds;
  else if (cat.includes('dry fruit') || cat.includes('berries')) pool = fallbacks.dryfruit;
  else if (cat.includes('sharbat') || cat.includes('beverage')) pool = fallbacks.drink;
  else if (cat.includes('spice')) pool = fallbacks.spice;
  else if (cat.includes('makhana') || cat.includes('snack') || cat.includes('chocolate')) pool = fallbacks.snack;
  
  return pool[product.id % pool.length];
}

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const products = await prisma.product.findMany();
  let updated = 0;
  
  for (const product of products) {
    let img = await searchWikiImage(product.name);
    
    // If not found, try a simplified search term
    if (!img) {
       const simpleName = product.name.replace(/[0-9]+g/, '').replace(/Reg(ular)?/, '').replace(/Mix/, '').trim();
       if (simpleName !== product.name) {
         await delay(100);
         img = await searchWikiImage(simpleName);
       }
    }
    
    if (!img) {
      // Third try: just the category name
      await delay(100);
      img = await searchWikiImage(product.category.replace('&', ' '));
    }
    
    // If still none, use fallback
    if (!img) {
      img = getFallback(product);
    }
    
    if (img !== product.img) {
      await prisma.product.update({
        where: { id: product.id },
        data: { img: img, images: JSON.stringify([img]) }
      });
      updated++;
      console.log(`Updated ${product.name} -> ${img}`);
    } else {
      console.log(`Kept ${product.name} (already optimal)`);
    }
    
    await delay(150); // Be nice to wikipedia api
  }
  
  console.log(`Finished updating ${updated} products.`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
