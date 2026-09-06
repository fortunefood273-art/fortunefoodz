const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const verifyToken = authRouter.verifyToken;
const prisma = require('../db');

// GET /api/wishlist - get the current user's cloud wishlist
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseId: req.user.uid } });
    if (!user) return res.json({ wishlist: [] });
    
    const wishlist = user.wishlist ? JSON.parse(user.wishlist) : [];
    res.json({ wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/wishlist - save the current user's wishlist (array of product IDs)
router.put('/', verifyToken, async (req, res) => {
  try {
    const { wishlist } = req.body; // array of product IDs
    if (!Array.isArray(wishlist)) {
      return res.status(400).json({ error: 'wishlist must be an array' });
    }
    
    await prisma.user.update({
      where: { firebaseId: req.user.uid },
      data: { wishlist: JSON.stringify(wishlist) }
    });
    
    res.json({ success: true, wishlist });
  } catch (error) {
    console.error('Error saving wishlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
