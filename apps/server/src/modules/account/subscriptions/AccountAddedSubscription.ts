import { subscriptionWithClientId } from 'graphql-relay-subscription';
import { withFilter } from 'graphql-subscriptions';
import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';
import { Account } from '../AccountModel';
import { accountField } from '../accountFields';

type AccountAddedPayload = {
	content: string;
};

const subscription = subscriptionWithClientId({
	name: 'AccountAdded',
	subscribe: withFilter(
		() => redisPubSub.asyncIterator(PUB_SUB_EVENTS.ACCOUNT.ADDED),
		async (payload: AccountAddedPayload, context) => {
			const account = await Account.findOne({
				_id: payload.content,
			});

			if (!account) {
				return false;
			}

			return true;
		}
	),
	getPayload: async (obj: AccountAddedPayload) => ({
		account: obj.content,
	}),
	outputFields: {
		...accountField('account'),
	},
});

export const AccountAddedSubscription = {
	...subscription,
};
