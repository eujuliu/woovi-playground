import { useMemo } from "react";
import { useSubscription } from "react-relay";
import type { GraphQLSubscriptionConfig } from "relay-runtime";
import type {
  AccountAddedSubscription,
  AccountAddedSubscription$variables,
} from "../../__generated__/AccountAddedSubscription.graphql";
import { AccountAdded } from "./AccountAddedSubscription";

const useAccountAddedSubscription = (
  variables: AccountAddedSubscription$variables,
  options?: Partial<GraphQLSubscriptionConfig<AccountAddedSubscription>>,
) => {
  const newAccountConfig = useMemo<
    GraphQLSubscriptionConfig<AccountAddedSubscription>
  >(
    () => ({
      subscription: AccountAdded,
      variables,
      ...options,
    }),
    [variables, options],
  );

  useSubscription(newAccountConfig);
};

export { useAccountAddedSubscription };
