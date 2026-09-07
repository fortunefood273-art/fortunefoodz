const fs = require('fs');
let c = fs.readFileSync('server/routes/settings.js', 'utf8');

c = c.replace(
  "siteAudioUrl && siteAudioUrl.startsWith('data:') ? await uploadToCloudinary(siteAudioUrl, 'fortune_foodz/audio') : siteAudioUrl;",
  "siteAudioUrl && siteAudioUrl.startsWith('data:') ? await uploadToCloudinary(siteAudioUrl, 'fortune_foodz/audio', 'video') : siteAudioUrl;"
);

fs.writeFileSync('server/routes/settings.js', c);
console.log('settings.js updated successfully.');
