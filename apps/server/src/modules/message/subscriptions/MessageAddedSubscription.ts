import { subscriptionWithClientId } from 'graphql-relay-subscription';
import { withFilter } from 'graphql-subscriptions';

import { messageField } from '../messageFields';
import { Message } from '../MessageModel';
import { redisPubSub } from '../../redis/redisPubSub';
import { PUB_SUB_EVENTS } from '../../redis/pubSubEvents';

type MessageAddedPayload = {
	message: string;
};

const subscription = subscriptionWithClientId({
	name: 'MessageAdded',
	subscribe: withFilter(
		() => redisPubSub.asyncIterator(PUB_SUB_EVENTS.MESSAGE.ADDED),
		async (payload: MessageAddedPayload, context) => {
			const message = await Message.findOne({
				_id: payload.message,
			});

			if (!message) {
				return false;
			}

			return true;
		}
	),
	getPayload: async (obj: MessageAddedPayload) => ({
		message: obj?.message,
	}),
	outputFields: {
		...messageField('message'),
	},
});

export const MessageAddedSubscription = {
	...subscription,
};
