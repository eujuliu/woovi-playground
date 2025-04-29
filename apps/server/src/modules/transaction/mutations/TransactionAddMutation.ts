import {
	GraphQLError,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLString,
} from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { Transaction } from '../TransactionModel';
import { transactionField } from '../transactionFields';
import { Account } from '../../account/AccountModel';
import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';

export type TransactionAddInput = {
	senderId: string;
	receiverId: string;
	amount: number;
};

const mutation = mutationWithClientMutationId({
	name: 'TransactionAdd',
	inputFields: {
		senderId: {
			type: new GraphQLNonNull(GraphQLString),
		},
		receiverId: {
			type: new GraphQLNonNull(GraphQLString),
		},
		amount: {
			type: new GraphQLNonNull(GraphQLInt),
		},
	},
	mutateAndGetPayload: async (args: TransactionAddInput) => {
		const session = await Transaction.startSession();

		try {
			session.startTransaction();

			if (args.receiverId === args.senderId) {
				throw new GraphQLError(
					"You can't send a transaction to the same account",
					{
						extensions: { code: 'INVALID_TRANSACTION' },
					}
				);
			}

			const sender = await Account.findOne({
				_id: args.senderId,
			}).session(session);

			const receiver = await Account.findOne({
				_id: args.receiverId,
			}).session(session);

			if (!sender || !receiver) {
				throw new GraphQLError('Sender or receiver not found', {
					extensions: { code: 'NOT_FOUND' },
				});
			}

			if (
				!sender.balance ||
				(sender.balance && sender.balance - args.amount < 0)
			) {
				throw new GraphQLError(
					"Sender user don't have balance for this transaction",
					{
						extensions: { code: 'INSUFFICIENT_BALANCE' },
					}
				);
			}

			sender.balance -= args.amount;
			receiver.balance += args.amount;

			await sender.save({ session });
			await receiver.save({ session });

			const transaction = await new Transaction({
				senderId: sender._id.toString(),
				receiverId: receiver._id.toString(),
				amount: args.amount,
			}).save({ session });

			await session.commitTransaction();
			await session.endSession();

			redisPubSub.publish(PUB_SUB_EVENTS.TRANSACTION.ADDED, {
				transaction: transaction._id.toString(),
			});

			return {
				transaction: transaction._id.toString(),
			};
		} catch (err) {
			await session.abortTransaction();
			await session.endSession();

			if (err instanceof GraphQLError) {
				throw err;
			}
			throw new GraphQLError('Internal server error', {
				extensions: { code: 'INTERNAL_SERVER_ERROR', originalError: err },
			});
		}
	},
	outputFields: {
		...transactionField('transaction'),
	},
});

export const TransactionAddMutation = {
	...mutation,
};
