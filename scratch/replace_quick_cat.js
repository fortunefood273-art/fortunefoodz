const fs = require('fs');
let c = fs.readFileSync('src/pages/HomePage.jsx', 'utf8');

c = c.replace(/className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide\s+px-2 md:px-12 py-3"/, 'className="px-2 md:px-12 py-3"');

fs.writeFileSync('src/pages/HomePage.jsx', c);
console.log('Replaced');
