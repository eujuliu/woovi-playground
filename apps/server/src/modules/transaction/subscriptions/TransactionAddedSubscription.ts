import { subscriptionWithClientId } from 'graphql-relay-subscription';
import { withFilter } from 'graphql-subscriptions';
import { redisPubSub } from '../../redis/redisPubSub';
import { PUB_SUB_EVENTS } from '../../redis/pubSubEvents';
import { Transaction } from '../TransactionModel';
import { transactionField } from '../transactionFields';

type TransactionAddedPayload = {
	id: string;
};

const subscription = subscriptionWithClientId({
	name: 'TransactionAdded',
	subscribe: withFilter(
		() => redisPubSub.asyncIterator(PUB_SUB_EVENTS.TRANSACTION.ADDED),
		async (payload: TransactionAddedPayload, context) => {
			const transaction = await Transaction.findOne({
				_id: payload.id,
			});

			if (!transaction) {
				return false;
			}

			return true;
		}
	),
	getPayload: async (obj: TransactionAddedPayload) => ({
		transaction: obj?.id,
	}),
	outputFields: {
		...transactionField('transaction'),
	},
});

export const TransactionAddedSubscription = {
	...subscription,
};
