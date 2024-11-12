const Redis = require('ioredis');

const ServerConfig = require('./serverConfig');

const redisConfig = {
    port: ServerConfig.REDIS_PORT,
    host: ServerConfig.REDIS_HOST,
    maxRetriesPerRequest: null,
    reconnectOnError: (error) => {
        console.log('Redis reconnecting due to error:', error);
        return true; // Automatically reconnect on error
    },
    maxRetriesPerRequest: null,  // Disable max retry limit
    retryStrategy: (times) => {
        return Math.min(times * 50, 2000); // Exponential backoff strategy
    }
};

let redisConnection;

try {
    redisConnection = new Redis(redisConfig);
    redisConnection.on('connect', () => {
        console.log("❤️  Redis connection done");
    });

    redisConnection.on('error', (error) => {
        console.error("❌ Error connecting to Redis:", error);
    });
} catch (error) {
    console.error("❌ Exception while creating Redis connection:", error);
}

module.exports = redisConnection;