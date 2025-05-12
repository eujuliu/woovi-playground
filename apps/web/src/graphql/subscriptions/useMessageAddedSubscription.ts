import { useMemo } from "react";
import { useSubscription } from "react-relay";
import type { GraphQLSubscriptionConfig } from "relay-runtime";
import type {
  MessageAddedSubscription,
  MessageAddedSubscription$variables,
} from "../../__generated__/MessageAddedSubscription.graphql";
import { MessageAdded } from "./MessageAddedSubscription";

const useMessageAddedSubscription = (
  variables: MessageAddedSubscription$variables,
) => {
  const newMessageConfig = useMemo<
    GraphQLSubscriptionConfig<MessageAddedSubscription>
  >(
    () => ({
      subscription: MessageAdded,
      variables,
      onNext(data) {
        console.log(data);
      },
    }),
    [variables],
  );

  useSubscription(newMessageConfig);
};

export { useMessageAddedSubscription };
