import { graphql } from 'graphql';
import { Message } from '../modules/message/MessageModel';
import { schema } from '../schema/schema';

describe('MESSAGE QUERY', () => {
	it('should get the first 5 messages', async () => {
		await Message.create([
			{ content: 'Message 1' },
			{ content: 'Message 2' },
			{ content: 'Message 3' },
			{ content: 'Message 4' },
			{ content: 'Message 5' },
		]);

		const query = `
      query {
        messages(first: 5) {
            edges {
                node {
                    id,
                    content,
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
		expect(result.data.messages.edges.length).toBe(5);
	});

	it('should not get any message', async () => {
		const query = `
      query {
        messages(first: 5) {
            edges {
                node {
                    id,
                    content,
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
		expect(result.data.messages.edges.length).toBe(0);
	});
});
