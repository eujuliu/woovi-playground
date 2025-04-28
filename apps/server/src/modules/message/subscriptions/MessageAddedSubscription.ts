import { subscriptionWithClientId } from 'graphql-relay-subscription';
import { withFilter } from 'graphql-subscriptions';

import { messageField } from '../messageFields';
import { Message } from '../MessageModel';
import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';

type MessageAddedPayload = {
	content: string;
};

const subscription = subscriptionWithClientId({
	name: 'MessageAdded',
	subscribe: withFilter(
		() => redisPubSub.asyncIterator(PUB_SUB_EVENTS.MESSAGE.ADDED),
		async (payload: MessageAddedPayload, context) => {
			const message = await Message.findOne({
				_id: payload.content,
			});

			if (!message) {
				return false;
			}

			return true;
		}
	),
	getPayload: async (obj: MessageAddedPayload) => ({
		message: obj?.content,
	}),
	outputFields: {
		...messageField('message'),
	},
});

export const MessageAddedSubscription = {
	...subscription,
};
