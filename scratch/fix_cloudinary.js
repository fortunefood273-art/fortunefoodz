const fs = require('fs');
let c = fs.readFileSync('server/utils/cloudinary.js', 'utf8');

c = c.replace(
  /folder: folder,/g,
  `folder: folder, resource_type: 'auto',`
);

fs.writeFileSync('server/utils/cloudinary.js', c);
console.log('Fixed cloudinary');
