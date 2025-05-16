import { useMutation } from "react-relay";
import { useState } from "react";

import { MessageAdd } from "../graphql/mutations/MessageAddMutation";
import type { MessageAddMutation } from "../__generated__/MessageAddMutation.graphql";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { LoaderCircle, SendIcon } from "lucide-react";

type MessageListProps = {
  children?: React.ReactNode;
};

export const MessageList = ({ children }: MessageListProps) => {
  const [content, setContent] = useState("");
  const [messageAdd, isPending] = useMutation<MessageAddMutation>(MessageAdd);
  const [visible, setVisibility] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    messageAdd({
      variables: {
        input: {
          content,
        },
      },
    });

    setContent("");
  };

  return (
    <div className="flex flex-col justify-end border rounded-sm bg-neutral-50">
      <Button
        variant="ghost"
        className="justify-start h-[34px] text-lg !rounded-b-none"
        onClick={() => setVisibility(!visible)}
      >
        Chat
      </Button>
      <div className={`overflow-hidden h-0 ${visible ? "h-full" : ""}`}>
        <div className="flex flex-col h-[500px] overflow-auto">{children}</div>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-1 items-center m-2">
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message"
            />
            <Button
              type="submit"
              className="bg-[#133a6f] hover:bg-[#113463] h-full rounded-sm transition duration-400"
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <SendIcon />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
