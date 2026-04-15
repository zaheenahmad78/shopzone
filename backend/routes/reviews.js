const express = require('express');
const router = express.Router();
const Review = require('../model/Review');
const Product = require('../model/Product');
const { protect } = require('../middleware/auth');

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add review (authenticated)
router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId: req.user.id });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }
    
    const review = await Review.create({
      productId,
      userId: req.user.id,
      userName: req.user.name || 'User',
      rating,
      comment
    });
    
    // Update product average rating
    const allReviews = await Review.find({ productId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(productId, { 
      rating: avgRating,
      numReviews: allReviews.length
    });
    
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete review (owner or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    
    if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await review.deleteOne();
    
    // Update product average rating
    const allReviews = await Review.find({ productId: review.productId });
    const avgRating = allReviews.length > 0 
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
      : 0;
    await Product.findByIdAndUpdate(review.productId, { 
      rating: avgRating,
      numReviews: allReviews.length
    });
    
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;