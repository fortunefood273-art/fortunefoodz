const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// POST /api/upload
// Accepts a base64-encoded file as JSON: { file: "data:image/...;base64,..." }
router.post('/', async (req, res) => {
  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file provided in request body' });
    }

    // Validate it looks like a base64 data URI
    if (!file.startsWith('data:')) {
      return res.status(400).json({ error: 'Invalid file format – expected base64 data URI' });
    }

    // Check Cloudinary credentials are set
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary env vars missing');
      return res.status(500).json({ error: 'Image upload service not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in Vercel environment variables.' });
    }

    // Upload base64 directly to Cloudinary (no temp file needed)
    const result = await cloudinary.uploader.upload(file, {
      resource_type: 'auto',
      folder: 'fortune_foodz_media',
      quality: 'auto:good',
      fetch_format: 'auto'
    });

    res.json({ url: result.secure_url, type: result.resource_type });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload file to Cloudinary' });
  }
});

module.exports = router;
