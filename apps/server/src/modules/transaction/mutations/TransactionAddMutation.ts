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

import { z } from 'zod';
import mongoose from 'mongoose';

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

		const Schema = z
			.object({
				senderId: z
					.string()
					.nonempty()
					.refine((id) => mongoose.Types.ObjectId.isValid(id), {
						message: 'Invalid MongoDB ID',
					}),
				receiverId: z
					.string()
					.nonempty()
					.refine((id) => mongoose.Types.ObjectId.isValid(id), {
						message: 'Invalid MongoDB ID',
					}),
				amount: z.number().positive(),
			})
			.transform((data) => ({
				senderId: data.senderId.trim(),
				receiverId: data.receiverId.trim(),
				amount: data.amount,
			}))
			.refine((data) => data.senderId !== data.receiverId, {
				message: 'Sender and receiver cannot be the same account',
				path: ['receiverId'],
			});

		try {
			session.startTransaction();

			const result = Schema.safeParse(args);

			if (!result.success) {
				throw new GraphQLError(result.error.message, {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			}

			const sender = await Account.findOne({
				_id: result.data.senderId,
			}).session(session);

			const receiver = await Account.findOne({
				_id: result.data.receiverId,
			}).session(session);

			if (!sender || !receiver) {
				throw new GraphQLError('Sender or receiver not found', {
					extensions: { code: 'NOT_FOUND' },
				});
			}

			if (
				!sender.balance ||
				(sender.balance && sender.balance - result.data.amount < 0)
			) {
				throw new GraphQLError(
					"Sender user don't have balance for this transaction",
					{
						extensions: { code: 'INSUFFICIENT_BALANCE' },
					}
				);
			}

			sender.balance -= result.data.amount;
			receiver.balance += result.data.amount;

			await sender.save({ session });
			await receiver.save({ session });

			const transaction = await new Transaction({
				senderId: sender._id.toString(),
				receiverId: receiver._id.toString(),
				amount: result.data.amount,
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
