import { graphql } from 'graphql';
import { schema } from '../schema/schema';
import { getContext } from '../server/getContext';

describe('MESSAGE MUTATION', () => {
	const mutation = `
    mutation MessageAddMutation(
      $input: MessageAddInput!
    ) {
      MessageAdd(input: $input) {
        message {
          id
          content
          createdAt
        }
      }
    }`;

	it('should create a new message', async () => {
		const variables = {
			input: {
				content: 'Test',
			},
		};

		const result = (await graphql({
			schema,
			source: mutation,
			variableValues: variables,
			contextValue: getContext(),
		})) as any;

		expect(result.data.MessageAdd.message).toHaveProperty('id');
		expect(result.data.MessageAdd.message).toHaveProperty('content');
		expect(result.data.MessageAdd.message).toHaveProperty('createdAt');
		expect(result.data.MessageAdd.message.content).toBe('Test');
	});

	it('should not be possible to create empty messages', async () => {
		const variables = {
			input: {
				content: '',
			},
		};

		const result = (await graphql({
			schema,
			source: mutation,
			variableValues: variables,
		})) as any;

		expect(result).toHaveProperty('errors');
		expect(result.errors[0].extensions.code).toBe('BAD_USER_INPUT');
	});
});
