import mongoose, { Document, Model } from "mongoose";

const Schema = new mongoose.Schema<ITransaction>(
  {
    senderId: {
      type: String,
      description: "The account id that will sending",
    },
    receiverId: {
      type: String,
      description: "The account id that will receiving",
    },
    amount: {
      type: Number,
      description: "The amount that will be transferred",
    },
  },
  {
    collection: "Transaction",
    timestamps: true,
  },
);

export type ITransaction = {
  senderId: string;
  receiverId: string;
  amount: number;
  createdAt: Date;
} & Document;

export const Transaction: Model<ITransaction> = mongoose.model(
  "Transaction",
  Schema,
);
