const Redis = require('ioredis');

const ServerConfig = require('./serverConfig');

const redisConfig = {
    port:ServerConfig.REDIS_PORT,
    host: ServerConfig.REDIS_HOST,
    maxRetriesPerRequest: null,
    retryStrategy: times => Math.min(times * 50, 2000)  // retry logic
};

let redisConnection;


    redisConnection = new Redis(redisConfig);
    redisConnection.on('connect', () => {
        console.log("❤️  Redis connection done");
    });

    redisConnection.on('error', (error) => {
        console.error("❌ Error connecting to Redis:", error);
    });


module.exports = redisConnection;