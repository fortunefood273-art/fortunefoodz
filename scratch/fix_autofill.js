const fs = require('fs');
let c = fs.readFileSync('src/components/CheckoutModal.jsx', 'utf8');

c = c.replace(
  /React\.useEffect\(\(\) => \{ if \(user\?\.email\) setForm\(f => \(\{ \.\.\.f, email: f\.email \|\| user\.email \}\)\); \}, \[user\]\);/,
  `React.useEffect(() => { if (user) setForm(f => ({ ...f, email: f.email || user.email || '', name: f.name || user.displayName || '' })); }, [user]);`
);

fs.writeFileSync('src/components/CheckoutModal.jsx', c);
console.log('Fixed autofill');
