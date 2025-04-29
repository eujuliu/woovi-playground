import { subscriptionWithClientId } from 'graphql-relay-subscription';
import { withFilter } from 'graphql-subscriptions';
import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';
import { Account } from '../AccountModel';
import { accountField } from '../accountFields';

type AccountAddedPayload = {
	message: string;
};

const subscription = subscriptionWithClientId({
	name: 'AccountAdded',
	subscribe: withFilter(
		() => redisPubSub.asyncIterator(PUB_SUB_EVENTS.ACCOUNT.ADDED),
		async (payload: AccountAddedPayload, context) => {
			console.log(payload);
			const account = await Account.findOne({
				_id: payload.message,
			});

			if (!account) {
				return false;
			}

			return true;
		}
	),
	getPayload: async (obj: AccountAddedPayload) => ({
		account: obj.message,
	}),
	outputFields: {
		...accountField('account'),
	},
});

export const AccountAddedSubscription = {
	...subscription,
};
