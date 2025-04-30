import { graphql } from 'graphql';
import { Transaction } from '../modules/transaction/TransactionModel';
import { schema } from '../schema/schema';

describe('TRANSACTION QUERY', () => {
	it('should get the first 5 transactions', async () => {
		await Transaction.create([
			{ type: 'TRANSFER', from: '1', to: '2', amount: 12 },
			{ type: 'TRANSFER', from: '3', to: '4', amount: 34 },
			{ type: 'TRANSFER', from: '5', to: '6', amount: 56 },
			{ type: 'TRANSFER', from: '7', to: '8', amount: 78 },
			{ type: 'TRANSFER', from: '9', to: '10', amount: 910 },
		]);

		const query = `
            query {
                transactions(first: 5) {
                    edges {
                        node {
                            id,
                            type,
                            from,
                            to,
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
                            type,
                            from,
                            to,
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
