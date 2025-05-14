import { GraphQLObjectType } from "graphql";

import { messageConnectionField } from "../modules/message/messageFields";
import { accountConnectionField } from "../modules/account/accountFields";
import { transactionConnectionField } from "../modules/transaction/transactionFields";

export const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    ...messageConnectionField("messages"),
    ...accountConnectionField("accounts"),
    ...transactionConnectionField("transactions"),
  }),
});
