import { useMemo } from "react";
import { useSubscription } from "react-relay";
import type { GraphQLSubscriptionConfig } from "relay-runtime";
import type {
  TransactionAddedSubscription,
  TransactionAddedSubscription$variables,
} from "../../__generated__/TransactionAddedSubscription.graphql";
import { TransactionAdded } from "./TransactionAddedSubscription";

const useTransactionAddedSubscription = (
  variables: TransactionAddedSubscription$variables,
) => {
  const newTransactionConfig = useMemo<
    GraphQLSubscriptionConfig<TransactionAddedSubscription>
  >(
    () => ({
      subscription: TransactionAdded,
      variables,
      onNext(data) {
        console.log(data);
      },
    }),
    [variables],
  );

  useSubscription(newTransactionConfig);
};

export { useTransactionAddedSubscription };
