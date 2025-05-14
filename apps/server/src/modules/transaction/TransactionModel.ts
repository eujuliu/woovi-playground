import mongoose, { Document, Model } from 'mongoose';

const Schema = new mongoose.Schema<ITransaction>(
	{
		type: {
			type: String,
			enum: ['DEPOSIT', 'TRANSFER'],
			description: 'The type of transaction',
		},
		from: {
			type: String,
			description: 'The account id that will send the amount',
		},
		to: {
			type: String,
			description: 'The account id that will receive the amount',
		},
		amount: {
			type: Number,
			description: 'The amount that will be transferred',
		},
	},
	{
		collection: 'Transaction',
		timestamps: true,
	}
);

export type ITransaction = {
	type: 'DEPOSIT' | 'TRANSFER';
	from: string;
	to: string;
	amount: number;
	createdAt: Date;
} & Document;

export const Transaction: Model<ITransaction> = mongoose.model(
	'Transaction',
	Schema
);
