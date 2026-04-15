const Razorpay = require('razorpay');
const logger = require('../config/logger');

// Lazy initialization - will be initialized when dotenv is loaded
let razorpay = null;

const getRazorpayInstance = () => {
  if (!razorpay) {
    try {
      razorpay = new Razorpay({
        key_id: "rzp_test_Sd32GvRYcYevAi",
        key_secret: "3j7birxbGsjNOLjqiTlZTtkH",
      });
      console.log('✅ Razorpay initialized successfully');
    } catch (error) {
      console.error('❌ Razorpay initialization failed:', error.message);
      return null;
    }
  }
  return razorpay;
};

class PaymentService {
  // Create Razorpay Order
  async createOrder(amount, currency = 'INR') {
    const razorpayInstance = getRazorpayInstance();
    if (!razorpayInstance) {
      throw new Error('Razorpay not configured. Please check API keys');
    }
    
    try {
      const options = {
        amount: amount * 100, // Convert to paise
        currency,
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
      };
      
      const order = await razorpayInstance.orders.create(options);
      logger.info(`Razorpay order created: ${order.id}`);
      return order;
    } catch (error) {
      logger.error('Razorpay order creation failed:', error);
      throw error;
    }
  }

  // Verify Razorpay Payment
  verifyPayment(orderId, paymentId, signature) {
    const crypto = require('crypto');
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', "3j7birxbGsjNOLjqiTlZTtkH")
      .update(body.toString())
      .digest('hex');
    
    return expectedSignature === signature;
  }

  // Get Payment Details
  async getPaymentDetails(paymentId) {
    const razorpayInstance = getRazorpayInstance();
    if (!razorpayInstance) {
      throw new Error('Razorpay not configured');
    }
    
    try {
      const payment = await razorpayInstance.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      logger.error('Fetch payment failed:', error);
      throw error;
    }
  }

  // Refund Payment
  async refundPayment(paymentId, amount) {
    const razorpayInstance = getRazorpayInstance();
    if (!razorpayInstance) {
      throw new Error('Razorpay not configured');
    }
    
    try {
      const refund = await razorpayInstance.payments.refund(paymentId, {
        amount: amount * 100
      });
      logger.info(`Refund processed for: ${paymentId}`);
      return refund;
    } catch (error) {
      logger.error('Refund failed:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();