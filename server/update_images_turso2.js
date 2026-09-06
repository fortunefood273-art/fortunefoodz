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

const seed_ids = ["1712342109846-a8fcb1c883ba","1466692476868-aef1dfb1e735","1590682680695-43b964a3ae17","1599320092708-8a9dde49fc2c","1563760836797-bf5d5f9d2243"];
const dry_fruit_ids = ["1600189020840-e9918c25269d","1543158181-1274e5362710","1502825751399-28baa9b81efe","1542990253-a781e04c0082","1626697556426-8a55a8af4999"];
const juice_ids = ["1600271886742-f049cd451bba","1603569283847-aa295f0d016a","1621506289937-a8e4df240d0b","1618724980108-a4d3856fd8f5","1546173159-315724a31696"];
const date_ids = ["1539998045166-682834a24072","1592398263902-35d5ff0540f8","1614061811858-dde54a522f5e","1691657917109-c6e027eac44a","1629738601425-494c3d6ba3e2"];
const spice_ids = ["1716816211590-c15a328a5ff0","1581600140682-d4e68c8cde32","1596040033229-a9821ebd058d","1506368249639-73a05d6f6488","1606914469633-bd39206ea739"];
const snack_ids = ["1621939514649-280e2ee25f60","1614735241165-6756e1df61ab","1688217170693-e821c6e18d72","1632687380457-05a1271e873b","1599490659213-e2b9527bd087"];
const food_ids = ["1546069901-ba9599a7e63c","1565299624946-b28f40a0ae38","1482049016688-2d3e1b311543","1555939594-58d7cb561ad1","1484723091739-30a097e8f929"];

const keywordMap = {
  // Seeds
  "Chia Seeds": seed_ids, "Flax Seeds": seed_ids, "Pumpkin Seeds": seed_ids, "Sunflower": seed_ids, "Seeds": seed_ids,

  // Dry Fruits & Nuts
  "Almond": dry_fruit_ids, "Badam": dry_fruit_ids, "Cashew": dry_fruit_ids, "Kaju": dry_fruit_ids, "Walnut": dry_fruit_ids,
  "Akrod": dry_fruit_ids, "Pista": dry_fruit_ids, "Nut": dry_fruit_ids,
  
  // Raisin / Fig / Dates
  "Raisin": date_ids, "Kishmish": date_ids, "Manuka": date_ids, "Fig": date_ids, "Anjeer": date_ids, 
  "Dates": date_ids, "Kharik": date_ids, "Apricot": date_ids,

  // Drinks
  "Sharbat": juice_ids, "Crush": juice_ids, "Syrup": juice_ids, "Juice": juice_ids,

  // Spices
  "Saffron": spice_ids, "Cardamom": spice_ids, "Pepper": spice_ids, "Clove": spice_ids, "Spice": spice_ids, "Methi": spice_ids,
  
  // Snacks / Makhana
  "Makhana": snack_ids, "Mix": snack_ids, "Murmura": snack_ids, "Party Mix": snack_ids, "Choclate": snack_ids
};

const all_pools = [seed_ids, dry_fruit_ids, juice_ids, date_ids, spice_ids, snack_ids, food_ids];

function getUrl(id) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`;
}

async function updateImages() {
  const products = await prisma.product.findMany();
  let updated = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    let selectedId = null;
    
    for (const [key, pool] of Object.entries(keywordMap)) {
      if (product.name.toLowerCase().includes(key.toLowerCase())) {
        selectedId = pool[product.id % pool.length];
        break;
      }
    }
    
    if (!selectedId) {
      for (const [key, pool] of Object.entries(keywordMap)) {
        if (product.category.toLowerCase().includes(key.toLowerCase())) {
          selectedId = pool[product.id % pool.length];
          break;
        }
      }
    }

    if (!selectedId) {
      const pool = all_pools[product.id % all_pools.length];
      selectedId = pool[product.id % pool.length];
    }

    const newImg = getUrl(selectedId);

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

updateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
