import { GraphQLString, GraphQLNonNull, GraphQLError } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { redisPubSub } from '../../redis/redisPubSub';
import { PUB_SUB_EVENTS } from '../../redis/pubSubEvents';

import { Message } from '../MessageModel';
import { messageField } from '../messageFields';

import { z } from 'zod';

export type MessageAddInput = {
	content: string;
};

const mutation = mutationWithClientMutationId({
	name: 'MessageAdd',
	inputFields: {
		content: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async (args: MessageAddInput) => {
		const Schema = z
			.object({
				content: z.string().min(1).nonempty(),
			})
			.transform((data) => ({
				content: data.content.trim(),
			}));

		try {
			const result = Schema.safeParse(args);

			if (!result.success) {
				throw new GraphQLError(result.error.message, {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			}

			const message = await new Message({
				content: result.data.content,
			}).save();

			redisPubSub.publish(PUB_SUB_EVENTS.MESSAGE.ADDED, {
				message: message._id.toString(),
			});

			return {
				message: message._id.toString(),
			};
		} catch (error) {
			if (error instanceof GraphQLError) {
				throw error;
			}

			throw new GraphQLError('Internal server error', {
				extensions: { code: 'INTERNAL_SERVER_ERROR', originalError: error },
			});
		}
	},
	outputFields: {
		...messageField('message'),
	},
});

export const MessageAddMutation = {
	...mutation,
};
