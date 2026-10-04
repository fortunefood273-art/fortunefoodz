const fs = require('fs');
let c = fs.readFileSync('src/components/PageLoader.jsx', 'utf8');

c = c.replace("style={{ width: \\`\\${progress}%\\` }}", "style={{ width: `${progress}%` }}");
fs.writeFileSync('src/components/PageLoader.jsx', c);
