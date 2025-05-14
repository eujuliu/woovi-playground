import {
	GraphQLEnumType,
	GraphQLID,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString,
} from 'graphql';
import { ITransaction } from './TransactionModel';
import { connectionDefinitions } from '@entria/graphql-mongo-helpers';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import { TransactionLoader } from './TransactionLoader';

export const TransactionTypeEnum = new GraphQLEnumType({
	name: 'TransactionTypeEnum',
	values: {
		DEPOSIT: { value: 'DEPOSIT' },
		TRANSFER: { value: 'TRANSFER' },
	},
});

const TransactionType = new GraphQLObjectType<ITransaction>({
	name: 'Transaction',
	description: 'Represents a transaction',
	fields: () => ({
		id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: (transaction) => transaction._id.toString(),
		},
		type: {
			type: TransactionTypeEnum,
			resolve: (transaction) => transaction.type,
		},
		from: {
			type: GraphQLString,
			resolve: (transaction) => transaction.from,
		},
		to: {
			type: GraphQLString,
			resolve: (transaction) => transaction.to,
		},
		amount: {
			type: GraphQLInt,
			resolve: (transaction) => transaction.amount,
		},
		createdAt: {
			type: GraphQLString,
			resolve: (transaction) => transaction.createdAt.toISOString(),
		},
	}),
	interfaces: () => [nodeInterface],
});

const TransactionConnection = connectionDefinitions({
	name: 'Transaction',
	nodeType: TransactionType,
});

registerTypeLoader(TransactionType, TransactionLoader.load);

export { TransactionType, TransactionConnection };
