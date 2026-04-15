const redis = require('redis');

let redisClient = null;
let connectionAttempts = 0;
const MAX_ATTEMPTS = 3;

const connectRedis = async () => {
  if (connectionAttempts >= MAX_ATTEMPTS) {
    console.log('⚠️ Redis: Max connection attempts reached. Running without Redis cache.');
    return null;
  }

  try {
    redisClient = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        connectTimeout: 5000,
        reconnectStrategy: false // Disable auto-reconnect
      }
    });

    redisClient.on('error', (err) => {
      console.log('⚠️ Redis not available:', err.message);
      redisClient = null;
    });

    await redisClient.connect();
    console.log('✅ Redis Connected');
    return redisClient;
  } catch (error) {
    connectionAttempts++;
    console.log(`⚠️ Redis connection failed (attempt ${connectionAttempts}/${MAX_ATTEMPTS})`);
    redisClient = null;
    return null;
  }
};

const getCache = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

const setCache = async (key, data, ttl = 3600) => {
  if (!redisClient) return false;
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
    return true;
  } catch (error) {
    return false;
  }
};

const invalidateCache = async (pattern) => {
  if (!redisClient) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) await redisClient.del(keys);
  } catch (error) {
    // Silent fail
  }
};

module.exports = { connectRedis, getCache, setCache, invalidateCache, redisClient };