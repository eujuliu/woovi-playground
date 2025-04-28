import mongoose, { Document, Model } from 'mongoose';

const Schema = new mongoose.Schema<IAccount>(
	{
		name: { type: String, description: 'The name of account' },
		balance: { type: Number, description: 'The balance of the account' },
	},
	{ collection: 'Account', timestamps: true }
);

export type IAccount = {
	name: string;
	balance: number;
	createdAt: Date;
} & Document;

export const Account: Model<IAccount> = mongoose.model('Account', Schema);
