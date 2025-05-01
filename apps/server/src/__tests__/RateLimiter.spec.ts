import request from 'supertest-graphql';
import { app } from '../server/app';
import { getBucket, updateBucket } from '../server/rateLimiter';

jest.mock('../server/rateLimiter', () => ({
	getBucket: jest.fn(),
	updateBucket: jest.fn(),
}));

const mockGetBucket = getBucket as jest.Mock;
const mockSetBucket = updateBucket as jest.Mock;

describe('RATE LIMITER', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const accountAddMutation = `
        mutation AccountAddMutation {
          AccountAdd(input: { name: "a" }) {
            account {
              id
              name
              balance
              createdAt
            }
          }
        }
      `;

	it('should allow request if have tokens and decrement 1', async () => {
		mockGetBucket.mockResolvedValue({ tokens: 9, lastUpdated: Date.now() });

		const { response, errors } = await request(app.callback())
			.mutate(accountAddMutation)
			.set('x-api-key', 'api-key-for-tests');

		expect(response.status).toBe(200);
		expect(errors).not.toBeNull();
		expect(mockSetBucket).toHaveBeenCalledWith(
			'api-key-for-tests',
			8,
			expect.any(Number)
		);
		expect(response.body).not.toEqual({ error: 'Rate limit exceeded' });
	});

	it('should return 401 and error if api-key is missing', async () => {
		mockGetBucket.mockResolvedValue({ tokens: 0, lastUpdated: Date.now() });

		const { response } = await request(app.callback()).mutate(
			accountAddMutation
		);

		expect(response.status).toBe(401);
		expect(response.body).toEqual({ error: 'API key is required' });
	});

	it('should return 429 and error if 0 tokens', async () => {
		mockGetBucket.mockResolvedValue({ tokens: 0, lastUpdated: Date.now() });

		const { response } = await request(app.callback())
			.mutate(accountAddMutation)
			.set('x-api-key', 'api-key-for-tests');

		expect(response.status).toBe(429);
		expect(response.body).toEqual({ error: 'Rate limit exceeded' });
	});
});
