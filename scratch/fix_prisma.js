const fs = require('fs');
let c = fs.readFileSync('server/prisma/schema.prisma', 'utf8');

if (!c.includes('details     String?')) {
  c = c.replace(
    /variants    String\?/g,
    `variants    String?\n  details     String?`
  );
  fs.writeFileSync('server/prisma/schema.prisma', c);
  console.log('Fixed prisma schema');
} else {
  console.log('Already fixed');
}
