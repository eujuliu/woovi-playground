import { connectionArgs } from '@entria/graphql-mongo-helpers';
import { AccountLoader } from './AccountLoader';
import { AccountConnection, AccountType } from './AccountType';

export const accountField = (key: string) => ({
	[key]: {
		type: AccountType,
		resolve: async (obj: Record<string, unknown>, _: any, context: any) =>
			AccountLoader.load(context, obj.account as string),
	},
});

export const accountConnectionField = (key: string) => ({
	[key]: {
		type: AccountConnection.connectionType,
		args: { ...connectionArgs },
		resolve: async (_: any, args: any, context: any) => {
			return await AccountLoader.loadAll(context, args);
		},
	},
});
