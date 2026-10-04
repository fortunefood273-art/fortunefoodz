const fs = require('fs');
let c = fs.readFileSync('src/components/CheckoutModal.jsx', 'utf8');

c = c.replace(
  /if \(validateForm\(\)\) goTo\(1\);/g,
  `if (validateForm()) goTo(stepsList.indexOf('Payment'));`
);

c = c.replace(
  /goTo\(2\);/g,
  `goTo(stepsList.indexOf('Order Placed'));`
);

fs.writeFileSync('src/components/CheckoutModal.jsx', c);
console.log('Fixed goTo calls');
