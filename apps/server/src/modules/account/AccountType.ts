import {
	GraphQLID,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString,
} from 'graphql';
import { IAccount } from './AccountModel';
import { connectionDefinitions } from 'graphql-relay';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import { AccountLoader } from './AccountLoader';

const AccountType = new GraphQLObjectType<IAccount>({
	name: 'Account',
	description: 'Represents an account',
	fields: () => ({
		id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: (account) => account._id.toString(),
		},
		name: { type: GraphQLString, resolve: (account) => account.name },
		balance: { type: GraphQLInt, resolve: (account) => account.balance },
		createdAt: {
			type: GraphQLString,
			resolve: (account) => account.createdAt.toISOString(),
		},
	}),
	interfaces: () => [nodeInterface],
});

const AccountConnection = connectionDefinitions({
	name: 'Account',
	nodeType: AccountType,
});

registerTypeLoader(AccountType, AccountLoader.load);

export { AccountType, AccountConnection };
