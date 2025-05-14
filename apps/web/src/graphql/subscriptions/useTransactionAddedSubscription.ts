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
  options?: Partial<GraphQLSubscriptionConfig<TransactionAddedSubscription>>,
) => {
  const newTransactionConfig = useMemo<
    GraphQLSubscriptionConfig<TransactionAddedSubscription>
  >(
    () => ({
      subscription: TransactionAdded,
      variables,
      ...options,
    }),
    [variables, options],
  );

  useSubscription(newTransactionConfig);
};

export { useTransactionAddedSubscription };
