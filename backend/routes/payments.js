const express = require('express');
const { createOrder, verifyPayment, getPaymentStatus } = require('../controllers/paymentController');
const { paymentLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Create payment order (rate limited)
router.post('/create-order', paymentLimiter, createOrder);

// Verify payment after Razorpay callback
router.post('/verify', paymentLimiter, verifyPayment);

// Get payment status
router.get('/status/:paymentId', getPaymentStatus);

module.exports = router;