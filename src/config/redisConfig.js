const Redis = require('ioredis');

const ServerConfig = require('./serverConfig');

const redisConfig = {
    port:ServerConfig.REDIS_PORT,
    host: ServerConfig.REDIS_HOST,
    maxRetriesPerRequest: null
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