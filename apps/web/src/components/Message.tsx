import { useFragment } from "react-relay";
import { DateTime } from "luxon";

import { WooviAvatar } from "./WooviAvatar";
import type { Message_message$key } from "../__generated__/Message_message.graphql";
import { MessageFragment } from "../graphql/fragments/Message";

type MessageProps = {
  message: Message_message$key;
};

export const Message = (props: MessageProps) => {
  const message = useFragment<Message_message$key>(
    MessageFragment,
    props.message,
  );

  return (
    <div className="flex flex-col p-2 gap-2">
      <div className="flex gap-1">
        <WooviAvatar />
        <div className="flex flex-col">
          <p className="font-medium">Woovi Playground</p>
          <p className="font-xs">
            {DateTime.fromISO(message.createdAt).toFormat("dd/MM/yyyy HH:mm")}
          </p>
        </div>
        <p>{message.content}</p>
      </div>
    </div>
  );
};
