import { GraphQLError, GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { Account } from "../AccountModel";
import { redisPubSub } from "../../pubSub/redisPubSub";
import { PUB_SUB_EVENTS } from "../../pubSub/pubSubEvents";
import { accountField } from "../../account/accountFields";

export type AccountAddInput = { name: string };

const mutation = mutationWithClientMutationId({
  name: "AccountAdd",
  inputFields: { name: { type: new GraphQLNonNull(GraphQLString) } },
  mutateAndGetPayload: async (args: AccountAddInput) => {
    try {
      const exists = await Account.findOne({ name: args.name });

      if (exists) {
        throw new GraphQLError(
          `An account with the name "${args.name}" already exists.`,
          {
            extensions: { code: "BAD_USER_INPUT" },
          },
        );
      }

      const account = await new Account({
        name: args.name,
        balance: 1000,
      }).save();

      redisPubSub.publish(PUB_SUB_EVENTS.ACCOUNT.ADDED, {
        account: account._id.toString(),
      });

      return { account: account._id.toString() };
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      }

      throw new GraphQLError("Internal server error", {
        extensions: { code: "INTERNAL_SERVER_ERROR", originalError: error },
      });
    }
  },
  outputFields: { ...accountField("account") },
});

export const AccountAddMutation = { ...mutation };
