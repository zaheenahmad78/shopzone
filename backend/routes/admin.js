const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../model/User');
const Order = require('../model/order');
const Product = require('../model/product');
const Coupon = require('../model/Coupon');
const Review = require('../model/Review');

// All admin routes are protected
router.use(protect, adminOnly);

// Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCoupons = await Coupon.countDocuments();
    const totalReviews = await Review.countDocuments();
    
    // Calculate total revenue
    const orders = await Order.find({ paymentStatus: 'completed' });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalCoupons,
        totalReviews,
        totalRevenue,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all products (admin)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product (admin)
router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name')
      .populate('productId', 'name');
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete review (admin)
router.delete('/reviews/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;