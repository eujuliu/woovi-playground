import { RedisPubSub } from "graphql-redis-subscriptions";
import { redisOptions } from "./ioredis";

export const redisPubSub = new RedisPubSub({
  connection: redisOptions,
});
