import { subscriptionWithClientId } from 'graphql-relay-subscription';
import { withFilter } from 'graphql-subscriptions';
import { redisPubSub } from '../../redis/redisPubSub';
import { PUB_SUB_EVENTS } from '../../redis/pubSubEvents';
import { Account } from '../AccountModel';
import { accountField } from '../accountFields';

type AccountAddedPayload = {
	id: string;
};

const subscription = subscriptionWithClientId({
	name: 'AccountAdded',
	subscribe: withFilter(
		() => redisPubSub.asyncIterator(PUB_SUB_EVENTS.ACCOUNT.ADDED),
		async (payload: AccountAddedPayload, context) => {
			const account = await Account.findOne({
				_id: payload.id,
			});

			if (!account) {
				return false;
			}

			return true;
		}
	),
	getPayload: async (obj: AccountAddedPayload) => ({
		account: obj?.id,
	}),
	outputFields: {
		...accountField('account'),
	},
});

export const AccountAddedSubscription = {
	...subscription,
};
