const Redis = require('ioredis');

const ServerConfig = require('./serverConfig');

const redisConfig = {
    port:ServerConfig.REDIS_PORT,
    host: ServerConfig.REDIS_HOST,
    password : ServerConfig.REDIS_PASSWORD,
    // maxRetriesPerRequest: null,
    // retryStrategy: times => Math.min(times * 50, 2000)  // retry logic
};

let redisConnection;


    redisConnection = new Redis(redisConfig);
    // redisConnection.on('connect', () => {
    //     console.log("❤️  Redis connection done");
    // });

    // redisConnection.on('error', (error) => {
    //     console.error("❌ Error connecting to Redis:", error);
    // });

    redisConnection.on('connect', () => {
        console.log(`[${new Date().toISOString()}] ❤️  Redis connection established`);
    });
    
    redisConnection.on('error', (error) => {
        console.error(`[${new Date().toISOString()}] ❌ Redis connection error:`, error);
    });
    
    redisConnection.on('close', () => {
        console.warn(`[${new Date().toISOString()}] Redis connection closed`);
    });
    
    redisConnection.on('reconnecting', (ms) => {
        console.log(`[${new Date().toISOString()}] Reconnecting to Redis in ${ms}ms`);
    });


module.exports = redisConnection;