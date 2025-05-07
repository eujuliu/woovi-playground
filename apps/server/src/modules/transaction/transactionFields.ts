import { connectionArgs } from '@entria/graphql-mongo-helpers';
import { TransactionLoader } from './TransactionLoader';
import { TransactionConnection, TransactionType } from './TransactionType';

export const transactionField = (key: string) => ({
	[key]: {
		type: TransactionType,
		resolve: async (obj: Record<string, unknown>, _: any, context: any) =>
			TransactionLoader.load(context, obj.transaction as string),
	},
});

export const transactionConnectionField = (key: string) => ({
	[key]: {
		type: TransactionConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: async (_: any, args: any, context: any) => {
			return await TransactionLoader.loadAll(context, args);
		},
	},
});
