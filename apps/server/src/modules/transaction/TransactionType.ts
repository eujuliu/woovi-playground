import {
	GraphQLID,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString,
} from 'graphql';
import { ITransaction } from './TransactionModel';
import { connectionDefinitions } from 'graphql-relay';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import { TransactionLoader } from './TransactionLoader';

const TransactionType = new GraphQLObjectType<ITransaction>({
	name: 'Transaction',
	description: 'Represents a transaction',
	fields: () => ({
		id: {
			type: new GraphQLNonNull(GraphQLID),
			resolve: (transaction) => transaction._id.toString(),
		},
		senderId: {
			type: GraphQLString,
			resolve: (transaction) => transaction.senderId,
		},
		receiverId: {
			type: GraphQLString,
			resolve: (transaction) => transaction.receiverId,
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
