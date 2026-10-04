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

const keywords = {
  // Seeds
  "Chia Seeds": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
  "Flax Seeds": "https://images.unsplash.com/photo-1590453303606-c87532a673b8?auto=format&fit=crop&w=400&q=80",
  "Pumpkin Seeds": "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?auto=format&fit=crop&w=400&q=80",
  "Sunflower": "https://images.unsplash.com/photo-1587049352847-4977a4c7f50d?auto=format&fit=crop&w=400&q=80",
  "Seeds": "https://images.unsplash.com/photo-1590453303606-c87532a673b8?auto=format&fit=crop&w=400&q=80",

  // Dry Fruits & Nuts
  "Almond": "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80",
  "Badam": "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80",
  "Cashew": "https://images.unsplash.com/photo-1604514588705-77df07a0c0a8?auto=format&fit=crop&w=400&q=80",
  "Kaju": "https://images.unsplash.com/photo-1604514588705-77df07a0c0a8?auto=format&fit=crop&w=400&q=80",
  "Walnut": "https://images.unsplash.com/photo-1585827552668-d0728b354e4c?auto=format&fit=crop&w=400&q=80",
  "Akrod": "https://images.unsplash.com/photo-1585827552668-d0728b354e4c?auto=format&fit=crop&w=400&q=80",
  "Pista": "https://images.unsplash.com/photo-1563606979261-1fc45f2bd347?auto=format&fit=crop&w=400&q=80",
  "Raisin": "https://images.unsplash.com/photo-1600189020847-fba298642735?auto=format&fit=crop&w=400&q=80",
  "Kishmish": "https://images.unsplash.com/photo-1600189020847-fba298642735?auto=format&fit=crop&w=400&q=80",
  "Manuka": "https://images.unsplash.com/photo-1600189020847-fba298642735?auto=format&fit=crop&w=400&q=80",
  "Fig": "https://images.unsplash.com/photo-1610444320297-f018e6c7104b?auto=format&fit=crop&w=400&q=80",
  "Anjeer": "https://images.unsplash.com/photo-1610444320297-f018e6c7104b?auto=format&fit=crop&w=400&q=80",
  "Dates": "https://images.unsplash.com/photo-1577484439169-32219d1b09b5?auto=format&fit=crop&w=400&q=80",
  "Kharik": "https://images.unsplash.com/photo-1577484439169-32219d1b09b5?auto=format&fit=crop&w=400&q=80",
  "Apricot": "https://images.unsplash.com/photo-1610444320297-f018e6c7104b?auto=format&fit=crop&w=400&q=80",
  "Nut": "https://images.unsplash.com/photo-1531024345371-33dc0f496359?auto=format&fit=crop&w=400&q=80",

  // Honey & Syrups
  "Honey": "https://images.unsplash.com/photo-1587049352847-4977a4c7f50d?auto=format&fit=crop&w=400&q=80",
  "Syrup": "https://images.unsplash.com/photo-1587049352847-4977a4c7f50d?auto=format&fit=crop&w=400&q=80",

  // Spices
  "Saffron": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
  "Cardamom": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
  "Pepper": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
  "Clove": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
  "Spice": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
  "Methi": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
  
  // Snacks / Makhana
  "Makhana": "https://images.unsplash.com/photo-1620023640248-cb94ff246c76?auto=format&fit=crop&w=400&q=80",
  "Mix": "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?auto=format&fit=crop&w=400&q=80",
  
  // Drinks
  "Sharbat": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80",
  "Crush": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80",
  
  // Ghee
  "Ghee": "https://images.unsplash.com/photo-1628190989938-1bcbf56dfbb5?auto=format&fit=crop&w=400&q=80",
  "Oil": "https://images.unsplash.com/photo-1628190989938-1bcbf56dfbb5?auto=format&fit=crop&w=400&q=80"
};

const fallbacks = [
  "https://images.unsplash.com/photo-1531024345371-33dc0f496359?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?auto=format&fit=crop&w=400&q=80"
];

async function updateImages() {
  const products = await prisma.product.findMany();
  let updated = 0;

  for (const product of products) {
    let newImg = null;
    
    for (const [key, url] of Object.entries(keywords)) {
      if (product.name.toLowerCase().includes(key.toLowerCase())) {
        newImg = url;
        break;
      }
    }
    
    if (!newImg) {
      for (const [key, url] of Object.entries(keywords)) {
        if (product.category.toLowerCase().includes(key.toLowerCase())) {
          newImg = url;
          break;
        }
      }
    }

    if (!newImg) {
      newImg = fallbacks[product.id % fallbacks.length];
    }

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
