import { GraphQLError, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { Account } from '../AccountModel';
import { redisPubSub } from '../../redis/redisPubSub';
import { PUB_SUB_EVENTS } from '../../redis/pubSubEvents';
import { accountField } from '../../account/accountFields';
import { z } from 'zod';

export type AccountAddInput = { name: string };

const mutation = mutationWithClientMutationId({
	name: 'AccountAdd',
	inputFields: { name: { type: new GraphQLNonNull(GraphQLString) } },
	mutateAndGetPayload: async (args: AccountAddInput) => {
		const Schema = z
			.object({
				name: z
					.string()
					.min(5)
					.regex(/^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$/g),
			})
			.transform((data) => ({
				name: data.name.trim(),
			}));

		try {
			const result = Schema.safeParse(args);

			if (!result.success) {
				throw new GraphQLError(result.error.issues[0].message, {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			}

			const exists = await Account.findOne({ name: result.data.name });

			if (exists) {
				throw new GraphQLError(
					`An account with the name "${result.data.name}" already exists.`,
					{
						extensions: { code: 'BAD_USER_INPUT' },
					}
				);
			}

			const account = await new Account({
				name: result.data.name,
				balance: 0,
			}).save();

			redisPubSub.publish(PUB_SUB_EVENTS.ACCOUNT.ADDED, {
				id: account._id.toString(),
			});

			return { account: account._id.toString() };
		} catch (error) {
			if (error instanceof GraphQLError) {
				throw error;
			}

			throw new GraphQLError('Internal server error', {
				extensions: { code: 'INTERNAL_SERVER_ERROR', originalError: error },
			});
		}
	},
	outputFields: { ...accountField('account') },
});

export const AccountAddMutation = { ...mutation };
