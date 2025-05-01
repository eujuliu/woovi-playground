import { redis } from '../modules/redis/ioredis';

export const MAX_TOKENS = 10;
const REGENERATION_RATE_MS = 5 * 60 * 1000; // 5 Minutes

export async function getBucket(id: string) {
	const key = `bucket:${id}`;
	const data = await redis.hgetall(key);
	const now = Date.now();

	let tokens = MAX_TOKENS;
	let lastUpdated = now;

	if (data && !isNaN(parseFloat(data.tokens))) {
		tokens = parseFloat(data.tokens);
		lastUpdated = parseInt(data.lastUpdated);
	}

	const elapsed = now - lastUpdated;
	const regenerated = Math.floor(elapsed / REGENERATION_RATE_MS);

	if (regenerated > 0) {
		tokens = Math.min(MAX_TOKENS, tokens + regenerated);
		lastUpdated = now;
	}

	return { tokens, lastUpdated };
}

export async function updateBucket(
	id: string,
	tokens: number,
	lastUpdated: number
) {
	await redis.hset(`bucket:${id}`, {
		tokens,
		lastUpdated,
	});
}
