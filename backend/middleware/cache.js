const { getCache, setCache } = require('../config/redis');

const cacheMiddleware = (duration = 3600) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    
    try {
      const cachedData = await getCache(key);
      
      if (cachedData) {
        return res.json({
          success: true,
          fromCache: true,
          data: cachedData
        });
      }
      
      // Store original send function
      const originalSend = res.json;
      
      res.json = function(data) {
        // Cache the response
        setCache(key, data, duration);
        originalSend.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

module.exports = cacheMiddleware;