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
import { redisPubSub } from '../../redis/redisPubSub';
import { PUB_SUB_EVENTS } from '../../redis/pubSubEvents';

import { z } from 'zod';
import mongoose from 'mongoose';
import { TransactionTypeEnum } from '../TransactionType';

export type TransactionAddInput = {
	from: string;
	to: string;
	amount: number;
};

const mutation = mutationWithClientMutationId({
	name: 'TransactionAdd',
	inputFields: {
		type: {
			type: new GraphQLNonNull(TransactionTypeEnum),
		},
		from: {
			type: new GraphQLNonNull(GraphQLString),
		},
		to: {
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
				type: z.enum(['DEPOSIT', 'TRANSFER']),
				from: z
					.string()
					.nonempty()
					.refine((id) => mongoose.Types.ObjectId.isValid(id), {
						message: 'Invalid MongoDB ID',
					}),
				to: z
					.string()
					.nonempty()
					.refine((id) => mongoose.Types.ObjectId.isValid(id), {
						message: 'Invalid MongoDB ID',
					}),
				amount: z.number().positive(),
			})
			.transform((data) => ({
				from: data.from.trim(),
				to: data.to.trim(),
				amount: data.amount,
				type: data.type,
			}))
			.refine((data) => data.from !== data.to, {
				message: 'Sender and receiver cannot be the same account',
				path: ['to'],
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
				_id: result.data.from,
			}).session(session);

			const receiver = await Account.findOne({
				_id: result.data.to,
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
				type: result.data.type,
				from: sender._id.toString(),
				to: receiver._id.toString(),
				amount: result.data.amount,
			}).save({ session });

			await session.commitTransaction();
			await session.endSession();

			redisPubSub.publish(PUB_SUB_EVENTS.TRANSACTION.ADDED, {
				id: transaction._id.toString(),
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
