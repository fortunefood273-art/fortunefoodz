const fs = require('fs');
let c = fs.readFileSync('server/routes/settings.js', 'utf8');

c = c.replace(
  /const uploadedLogo = await uploadToCloudinary\(logoBase64, 'fortune_foodz\/settings'\);/g,
  `const uploadedLogo = await uploadToCloudinary(logoBase64, 'fortune_foodz/settings');\n    const uploadedAudio = siteAudioUrl && siteAudioUrl.startsWith('data:') ? await uploadToCloudinary(siteAudioUrl, 'fortune_foodz/audio') : siteAudioUrl;`
);

c = c.replace(
  /siteAudioUrl: siteAudioUrl !== undefined \? siteAudioUrl : null,/g,
  `siteAudioUrl: uploadedAudio !== undefined ? uploadedAudio : null,`
);

fs.writeFileSync('server/routes/settings.js', c);
console.log('Fixed settings.js');
