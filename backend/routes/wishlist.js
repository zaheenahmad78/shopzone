const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Get user's wishlist
router.get('/', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id })
      .populate('products.productId');
    
    if (!wishlist) {
      wishlist = { products: [] };
    }
    
    res.json({ success: true, data: wishlist.products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add product to wishlist
router.post('/add', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    
    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.user.id,
        products: [{ productId, addedAt: new Date() }]
      });
    } else {
      const alreadyExists = wishlist.products.some(
        p => p.productId.toString() === productId
      );
      
      if (alreadyExists) {
        return res.status(400).json({ error: 'Product already in wishlist' });
      }
      
      wishlist.products.push({ productId, addedAt: new Date() });
    }
    
    await wishlist.save();
    res.json({ success: true, message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove product from wishlist
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    
    wishlist.products = wishlist.products.filter(
      p => p.productId.toString() !== req.params.productId
    );
    
    await wishlist.save();
    res.json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    
    let inWishlist = false;
    if (wishlist) {
      inWishlist = wishlist.products.some(
        p => p.productId.toString() === req.params.productId
      );
    }
    
    res.json({ success: true, inWishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;