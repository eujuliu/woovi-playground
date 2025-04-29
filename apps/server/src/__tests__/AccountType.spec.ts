import { graphql } from 'graphql';
import { Account } from '../modules/account/AccountModel';
import { schema } from '../schema/schema';

describe('ACCOUNT QUERY', () => {
	it('should get the first 5 accounts', async () => {
		await Account.create([
			{ name: 'Account 1' },
			{ name: 'Account 2' },
			{ name: 'Account 3' },
			{ name: 'Account 4' },
			{ name: 'Account 5' },
		]);

		const query = `
        query {
          accounts(first: 5) {
              edges {
                  node {
                      id,
                      name,
                      balance,
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
		expect(result.data.accounts.edges.length).toBe(5);
	});

	it('should not get any account', async () => {
		const query = `
        query {
          accounts(first: 5) {
              edges {
                  node {
                      id,
                      name,
                      balance,
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
		expect(result.data.accounts.edges.length).toBe(0);
	});
});
