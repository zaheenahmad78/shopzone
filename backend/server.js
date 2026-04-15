const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");

// Existing Routes
const authRoutes = require("./routes/authRoutes");

// ✅ NEW: Senior Level Features
const paymentRoutes = require("./routes/payments");
const reviewRoutes = require("./routes/reviews");
const wishlistRoutes = require("./routes/wishlist");
const couponRoutes = require("./routes/coupons");
const adminRoutes = require("./routes/admin");  // 🆕 ADMIN ROUTES
const { apiLimiter } = require("./middleware/rateLimiter");
const { connectRedis } = require("./config/redis");
const logger = require("./config/logger");

dotenv.config();

const app = express();

// ==================== EXISTING MIDDLEWARES ====================
app.use(cors());
app.use(express.json());

// ==================== ✅ NEW: Security & Performance ====================
app.use(helmet());           // Security headers
app.use(compression());      // Response compression

// ==================== ✅ NEW: Global Rate Limiting ====================
app.use(apiLimiter);

// ==================== ✅ NEW: Request Logging Middleware ====================
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// ==================== EXISTING ROUTES ====================
app.use("/api/auth", authRoutes);

// ==================== ✅ NEW: Payment Routes ====================
app.use("/api/payments", paymentRoutes);

// ==================== ✅ NEW: Review Routes ====================
app.use("/api/reviews", reviewRoutes);

// ==================== ✅ NEW: Wishlist Routes ====================
app.use("/api/wishlist", wishlistRoutes);

// ==================== ✅ NEW: Coupon Routes ====================
app.use("/api/coupons", couponRoutes);

// ==================== ✅ NEW: Admin Routes ====================
app.use("/api/admin", adminRoutes);

// ==================== EXISTING HOME ROUTE ====================
app.get("/", (req, res) => {
  res.json({ message: "ShopZone API is running!" });
});

// ==================== ✅ NEW: Health Check Endpoint ====================
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// ==================== ✅ NEW: Global Error Handler ====================
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// ==================== DATABASE CONNECTION ====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected!");
    logger.info("MongoDB connected");
    
    // Try Redis but don't let it block server startup
    try {
      await connectRedis();
    } catch (redisError) {
      console.log("⚠️ Redis not available, running without cache");
    }
    
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
      logger.info(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err);
    logger.error("MongoDB connection error:", err);
  });