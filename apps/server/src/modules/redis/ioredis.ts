/* eslint-disable turbo/no-undeclared-env-vars */
import { Redis } from 'ioredis';
import { config } from '../../config';

export const redis = new Redis(process.env.REDIS_HOST ?? '');
