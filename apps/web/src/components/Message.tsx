import { Box, Card, Typography } from "@mui/material";
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
    <Card
      variant="outlined"
      sx={{ display: "flex", flexDirection: "column", p: 2, gap: 2 }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        <WooviAvatar />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography fontWeight={500}>Woovi Playground</Typography>
          <Typography variant="body2">
            {DateTime.fromISO(message.createdAt).toFormat("dd/MM/yyyy HH:mm")}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2">{message.content}</Typography>
    </Card>
  );
};
