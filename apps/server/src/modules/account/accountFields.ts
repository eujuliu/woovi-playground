import { connectionArgs } from 'graphql-relay';
import { AccountLoader } from './AccountLoader';
import { AccountConnection, AccountType } from './AccountType';

export const accountField = (key: string) => ({
	[key]: {
		type: AccountType,
		resolve: async (obj: Record<string, unknown>, _, context) =>
			AccountLoader.load(context, obj.account as string),
	},
});

export const accountConnectionField = (key: string) => ({
	[key]: {
		type: AccountConnection.connectionType,
		args: { ...connectionArgs },
		resolve: async (_, args, context) => {
			return await AccountLoader.loadAll(context, args);
		},
	},
});
