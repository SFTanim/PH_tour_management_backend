"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
/* eslint-disable no-console */
const redis_1 = require("redis");
const env_1 = require("./env");
exports.redisClient = (0, redis_1.createClient)({
    username: env_1.envVars.REDIS.REDIS_USERNAME,
    password: env_1.envVars.REDIS.REDIS_PASSWORD,
    socket: {
        host: env_1.envVars.REDIS.REDIS_HOST,
        port: Number(env_1.envVars.REDIS.REDIS_PORT)
    }
});
exports.redisClient.on('error', err => console.log('Redis Client Error', err));
const connectRedis = async () => {
    if (!exports.redisClient.isOpen) {
        await exports.redisClient.connect();
        console.log("Redis Connected");
    }
};
exports.connectRedis = connectRedis;
// await redisClient.set(key, value);
// await redisClient.set('foo', 'bar');
// const result = await redisClient.get('foo');
// console.log(result)  // >>> bar
//# sourceMappingURL=redis.config.js.map