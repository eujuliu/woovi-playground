import { DateTime } from "luxon";
import { HTMLProps } from "react";
import { usePreloadedQuery, type PreloadedQuery } from "react-relay";
import { toast } from "sonner";
import { Message } from "../components/Message";
import { MessageList } from "../components/MessageList";
import { MessagesQuery } from "../graphql/queries/Messages";
import { useMessageAddedSubscription } from "../graphql/subscriptions/useMessageAddedSubscription";
import type { MessagesQuery as MessageQueryType } from "../__generated__/MessagesQuery.graphql";

type Props = {
  queryRef: PreloadedQuery<MessageQueryType>;
} & Partial<HTMLProps<HTMLDivElement>>;

export const Chat = ({ queryRef, ...props }: Props) => {
  const data = usePreloadedQuery<MessageQueryType>(MessagesQuery, queryRef);

  useMessageAddedSubscription(
    {
      connections: [data.messages?.__id],
      input: {},
    },
    {
      onNext(data) {
        const message = data.MessageAdded.message;
        toast("New message", {
          description: `Message ${message.id} created at ${DateTime.fromISO(message.createdAt).toFormat("dd/MM/yyyy HH:mm")}`,
          position: "top-right",
        });
      },
    },
  );

  return (
    <div {...props}>
      <MessageList>
        {data.messages.edges.map(({ node }) => (
          <Message key={node.id} message={node} />
        ))}
      </MessageList>
    </div>
  );
};
