import { graphql } from 'graphql';
import { Transaction } from '../modules/transaction/TransactionModel';
import { schema } from '../schema/schema';

describe('TRANSACTION QUERY', () => {
	it('should get the first 5 transactions', async () => {
		await Transaction.create([
			{ senderId: '1', receiverId: '2', amount: 12 },
			{ senderId: '3', receiverId: '4', amount: 34 },
			{ senderId: '5', receiverId: '6', amount: 56 },
			{ senderId: '7', receiverId: '8', amount: 78 },
			{ senderId: '9', receiverId: '10', amount: 910 },
		]);

		const query = `
      query {
        transactions(first: 5) {
            edges {
                node {
                    id,
                    senderId,
                    receiverId,
                    amount,
                    createdAt
                }
            }
        }
      }`;

		const result = (await graphql({
			schema,
			source: query,
		})) as any;

		expect(result).not.toHaveProperty('errors');
		expect(result.data.transactions.edges.length).toBe(5);
	});

	it('should not get any message', async () => {
		const query = `
      query {
        transactions(first: 5) {
            edges {
                node {
                    id,
                    senderId,
                    receiverId,
                    amount,
                    createdAt
                }
            }
        }
      }`;

		const result = (await graphql({
			schema,
			source: query,
		})) as any;

		expect(result).not.toHaveProperty('errors');
		expect(result.data.transactions.edges.length).toBe(0);
	});
});
