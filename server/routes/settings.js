const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { uploadToCloudinary } = require('../utils/cloudinary');

// GET settings (normally fetched via /api/data, but useful directly)
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.frontendSetting.findFirst();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT update settings
router.put('/', async (req, res) => {
  try {
    const {
      storeName, tagline, logoChar, footerDescription,
      facebookUrl, instagramUrl, youtubeUrl, whatsappNumber,
      logoBase64, razorpayKeyId, whatsappOrderNumber,
      siteAudioUrl, contactEmail, contactPhone
    } = req.body;
    
    // Upload logo to Cloudinary if it's new (base64)
    const uploadedLogo = logoBase64 && logoBase64.startsWith('data:') ? await uploadToCloudinary(logoBase64, 'fortune_foodz/settings') : logoBase64;
    const uploadedAudio = siteAudioUrl && siteAudioUrl.startsWith('data:') ? await uploadToCloudinary(siteAudioUrl, 'fortune_foodz/audio', 'video') : siteAudioUrl;

    let settings = await prisma.frontendSetting.findFirst();

    const data = {};
    if (storeName !== undefined) data.storeName = storeName || '';
    if (tagline !== undefined) data.tagline = tagline || '';
    if (logoChar !== undefined) data.logoChar = logoChar || '';
    if (footerDescription !== undefined) data.footerDescription = footerDescription || '';
    if (facebookUrl !== undefined) data.facebookUrl = facebookUrl || '';
    if (instagramUrl !== undefined) data.instagramUrl = instagramUrl || '';
    if (youtubeUrl !== undefined) data.youtubeUrl = youtubeUrl || '';
    if (whatsappNumber !== undefined) data.whatsappNumber = whatsappNumber || '';
    if (razorpayKeyId !== undefined) data.razorpayKeyId = razorpayKeyId;
    if (whatsappOrderNumber !== undefined) data.whatsappOrderNumber = whatsappOrderNumber;
    if (siteAudioUrl !== undefined) data.siteAudioUrl = uploadedAudio;
    if (contactEmail !== undefined) data.contactEmail = contactEmail;
    if (contactPhone !== undefined) data.contactPhone = contactPhone;
    if (logoBase64 !== undefined) {
       data.logoBase64 = uploadedLogo || (settings ? settings.logoBase64 : '');
    }

    if (settings) {
      settings = await prisma.frontendSetting.update({
        where: { id: settings.id },
        data
      });
    } else {
      settings = await prisma.frontendSetting.create({ data });
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
