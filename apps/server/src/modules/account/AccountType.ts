import {
	GraphQLID,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLScalarType,
	GraphQLString,
	Kind,
} from 'graphql';
import { IAccount } from './AccountModel';
import { connectionDefinitions } from 'graphql-relay';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import { AccountLoader } from './AccountLoader';

const GraphQLLong = new GraphQLScalarType({
	name: 'Long',
	description: 'A custom scalar to handle 64-bit integers',
	serialize(value) {
		if (typeof value !== 'number' && typeof value !== 'bigint') {
			throw new TypeError('Value is not a number or bigint');
		}
		return value;
	},
	parseValue(value) {
		if (typeof value !== 'number' && typeof value !== 'string') {
			throw new TypeError('Value is not a number or string');
		}
		return BigInt(value);
	},
	parseLiteral(value) {
		if (value.kind === Kind.INT || value.kind === Kind.STRING) {
			return BigInt(value.value);
		}
		throw new TypeError('Value is not an integer or string');
	},
});

const AccountType = new GraphQLObjectType<IAccount>({
	name: 'Account',
	description: 'Represents an account',
	fields: () => ({
		id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: (account) => account._id.toString(),
		},
		name: { type: GraphQLString, resolve: (account) => account.name },
		balance: { type: GraphQLLong, resolve: (account) => account.balance },
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
