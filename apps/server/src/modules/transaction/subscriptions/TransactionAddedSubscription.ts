import { subscriptionWithClientId } from "graphql-relay-subscription";
import { withFilter } from "graphql-subscriptions";
import { redisPubSub } from "../../pubSub/redisPubSub";
import { PUB_SUB_EVENTS } from "../../pubSub/pubSubEvents";
import { Transaction } from "../TransactionModel";
import { transactionField } from "../transactionFields";

type TransactionAddedPayload = {
  message: string;
};

const subscription = subscriptionWithClientId({
  name: "TransactionAdded",
  subscribe: withFilter(
    () => redisPubSub.asyncIterator(PUB_SUB_EVENTS.TRANSACTION.ADDED),
    async (payload: TransactionAddedPayload, context) => {
      const transaction = await Transaction.findOne({
        _id: payload.message,
      });

      if (!transaction) {
        return false;
      }

      return true;
    },
  ),
  getPayload: async (obj: TransactionAddedPayload) => ({
    message: obj?.message,
  }),
  outputFields: {
    ...transactionField("transaction"),
  },
});

export const TransactionAddedSubscription = {
  ...subscription,
};
