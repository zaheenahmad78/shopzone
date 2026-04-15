const paymentService = require('../services/paymentService');
const logger = require('../config/logger');
const Order = require('../models/Order');

// Create payment order
const createOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const order = await paymentService.createOrder(amount);
    
    // Store order reference in database
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        razorpayOrderId: order.id,
        paymentStatus: 'pending'
      });
    }

    logger.info(`Payment order created: ${order.id} for amount: ${amount}`);
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      }
    });
  } catch (error) {
    logger.error('Create order error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature, orderData } = req.body;
    
    const isValid = paymentService.verifyPayment(orderId, paymentId, signature);
    
    if (isValid) {
      // Update order status in database
      if (orderData) {
        const order = new Order({
          ...orderData,
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          paymentStatus: 'completed',
          status: 'confirmed'
        });
        await order.save();
      }
      
      logger.info(`Payment verified: ${paymentId}`);
      res.json({
        success: true,
        message: 'Payment verified successfully',
        orderId: orderId
      });
    } else {
      logger.warn(`Invalid payment signature for: ${paymentId}`);
      res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }
  } catch (error) {
    logger.error('Verify payment error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await paymentService.getPaymentDetails(paymentId);
    
    res.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount / 100,
        method: payment.method
      }
    });
  } catch (error) {
    logger.error('Get payment status error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOrder, verifyPayment, getPaymentStatus };