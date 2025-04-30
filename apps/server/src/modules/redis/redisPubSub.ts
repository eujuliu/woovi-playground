import { RedisPubSub } from 'graphql-redis-subscriptions';
import { redis } from './ioredis';

export const redisPubSub = new RedisPubSub({
	subscriber: redis,
});
