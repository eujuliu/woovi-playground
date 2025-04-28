import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';
import { IAccount } from './AccountModel';
import { connectionDefinitions, globalIdField } from 'graphql-relay';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import { AccountLoader } from './AccountLoader';

const AccountType = new GraphQLObjectType<IAccount>({
	name: 'Account',
	description: 'Represents an account',
	fields: () => ({
		id: globalIdField('Account'),
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
