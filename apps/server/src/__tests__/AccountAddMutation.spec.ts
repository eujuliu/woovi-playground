import { graphql } from 'graphql';
import { schema } from '../schema/schema';
import { getContext } from '../server/getContext';

describe('ACCOUNT MUTATION', () => {
	const mutation = `
    mutation AccountAddMutation(
      $input: AccountAddInput!
    ) {
      AccountAdd(input: $input) {
        account {
          id
          name
          balance
          createdAt
        }
      }
    }`;

	it('should create a new account', async () => {
		const variables = {
			input: {
				name: 'Account 1',
			},
		};

		const result = (await graphql({
			schema,
			source: mutation,
			variableValues: variables,
			contextValue: getContext(),
		})) as any;

		expect(result.data.AccountAdd.account).toHaveProperty('id');
		expect(result.data.AccountAdd.account).toHaveProperty('name');
		expect(result.data.AccountAdd.account).toHaveProperty('balance');
		expect(result.data.AccountAdd.account).toHaveProperty('createdAt');
		expect(result.data.AccountAdd.account.balance).toBe(0);
	});

	it('should not create a duplicated account', async () => {
		const variables = {
			input: {
				name: 'Account 1',
			},
		};

		await graphql({
			schema,
			source: mutation,
			variableValues: variables,
			contextValue: getContext(),
		});

		const result = (await graphql({
			schema,
			source: mutation,
			variableValues: variables,
			contextValue: getContext(),
		})) as any;

		expect(result).toHaveProperty('errors');
		expect(result.errors[0].extensions.code).toBe('BAD_USER_INPUT');
		expect(result.data.AccountAdd).toBeNull();
	});

	it('should not create a account with empty name', async () => {
		const variables = {
			input: {
				name: '',
			},
		};

		const result = (await graphql({
			schema,
			source: mutation,
			variableValues: variables,
			contextValue: getContext(),
		})) as any;

		expect(result).toHaveProperty('errors');
		expect(result.errors[0].extensions.code).toBe('BAD_USER_INPUT');
		expect(result.data.AccountAdd).toBeNull();
	});

	it('should not create a account with name length less than 5', async () => {
		const variables = {
			input: {
				name: 'Abcd',
			},
		};

		const result = (await graphql({
			schema,
			source: mutation,
			variableValues: variables,
			contextValue: getContext(),
		})) as any;

		expect(result).toHaveProperty('errors');
		expect(result.errors[0].extensions.code).toBe('BAD_USER_INPUT');
		expect(result.data.AccountAdd).toBeNull();
	});

	it('should not be possible to use non alphanumerics', async () => {
		const variables = {
			input: {
				name: '%$^$%#@',
			},
		};

		const result = (await graphql({
			schema,
			source: mutation,
			variableValues: variables,
			contextValue: getContext(),
		})) as any;

		expect(result).toHaveProperty('errors');
		expect(result.errors[0].extensions.code).toBe('BAD_USER_INPUT');
		expect(result.data.AccountAdd).toBeNull();
	});
});
