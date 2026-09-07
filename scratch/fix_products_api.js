const fs = require('fs');
let c = fs.readFileSync('server/routes/products.js', 'utf8');

c = c.replace(
  /const { name, brand, price, mrp, rating, reviews, img, images, tag, badge, category, petType, description, variants } = req.body;/g,
  `const { name, brand, price, mrp, rating, reviews, img, images, tag, badge, category, petType, description, variants, details } = req.body;`
);

c = c.replace(
  /variants: typeof variants === 'string' \? variants : JSON\.stringify\(variants || \[\]\)/g,
  `variants: typeof variants === 'string' ? variants : JSON.stringify(variants || []),\n          details: typeof details === 'string' ? details : JSON.stringify(details || {})`
);

fs.writeFileSync('server/routes/products.js', c);
console.log('Fixed products.js');
