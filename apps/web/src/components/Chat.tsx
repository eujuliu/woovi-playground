import { usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { Message } from "../components/Message";
import { MessageList } from "../components/MessageList";
import { MessagesQuery } from "../graphql/queries/Messages";
import { useMessageAddedSubscription } from "../graphql/subscriptions/useMessageAddedSubscription";
import type { MessagesQuery as MessageQueryType } from "../__generated__/MessagesQuery.graphql";

type Props = {
  queryRef: PreloadedQuery<MessageQueryType>;
};

export const Chat = ({ queryRef }: Props) => {
  const data = usePreloadedQuery<MessageQueryType>(MessagesQuery, queryRef);

  useMessageAddedSubscription({
    connections: [data.messages?.__id],
    input: {},
  });

  return (
    <div className="max-w-[350px] max-h-[600px] w-full">
      <MessageList>
        {data.messages.edges.map(({ node }) => (
          <Message key={node.id} message={node} />
        ))}
      </MessageList>
    </div>
  );
};
