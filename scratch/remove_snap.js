const fs = require('fs');
let c = fs.readFileSync('src/pages/HomePage.jsx', 'utf8');

c = c.replace(/snap-x/g, '');
c = c.replace(/snap-mandatory/g, '');
c = c.replace(/snap-start/g, '');
c = c.replace(/snap-center/g, '');

fs.writeFileSync('src/pages/HomePage.jsx', c);
console.log('Removed snap classes');
