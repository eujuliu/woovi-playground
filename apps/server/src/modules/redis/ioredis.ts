/* eslint-disable turbo/no-undeclared-env-vars */
import { Redis, type RedisOptions } from "ioredis";
import { config } from "../../config";

export let redisOptions: RedisOptions = {
  host: config.REDIS_HOST,
  password: config.REDIS_PASSWORD,
  username: config.REDIS_USERNAME,
  retryStrategy: (times) => Math.min(times * 50, 2000),
};

if (config.REDIS_SENTINEL && config.REDIS_SENTINEL.length > 0) {
  redisOptions = {
    sentinels: config.REDIS_SENTINEL,
    username: config.REDIS_USERNAME,
    password: config.REDIS_PASSWORD,
    name: "mymaster",
    role: "master",
    sentinelRetryStrategy: (times) => Math.min(times * 50, 2000),
  };
}

export const redis = new Redis(redisOptions);
