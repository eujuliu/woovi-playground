import { MessageType, MessageConnection } from './MessageType';
import { MessageLoader } from './MessageLoader';
import { connectionArgs } from '@entria/graphql-mongo-helpers';

export const messageField = (key: string) => ({
	[key]: {
		type: MessageType,
		resolve: async (obj: Record<string, unknown>, _: any, context: any) =>
			MessageLoader.load(context, obj.message as string),
	},
});

export const messageConnectionField = (key: string) => ({
	[key]: {
		type: MessageConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: async (_: any, args: any, context: any) => {
			return await MessageLoader.loadAll(context, args);
		},
	},
});
