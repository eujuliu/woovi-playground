import { GraphQLString, GraphQLNonNull, GraphQLError } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';

import { Message } from '../MessageModel';
import { messageField } from '../messageFields';

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
		try {
			if (args.content.trim().length < 1) {
				throw new GraphQLError("Can't create an empty message", {
					extensions: { code: 'EMPTY_MESSAGE' },
				});
			}

			const message = await new Message({
				content: args.content,
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
