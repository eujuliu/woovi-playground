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
) => {
  const newAccountConfig = useMemo<
    GraphQLSubscriptionConfig<AccountAddedSubscription>
  >(
    () => ({
      subscription: AccountAdded,
      variables,
      onNext(data) {
        console.log(data);
      },
    }),
    [variables],
  );

  useSubscription(newAccountConfig);
};

export { useAccountAddedSubscription };
