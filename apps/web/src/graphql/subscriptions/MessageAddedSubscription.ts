import { graphql } from "react-relay";

const MessageAdded = graphql`
  subscription MessageAddedSubscription(
    $input: MessageAddedInput!
    $connections: [ID!]!
  ) {
    MessageAdded(input: $input) {
      message
        @appendNode(connections: $connections, edgeTypeName: "MessageEdge") {
        id
        content
        createdAt
        ...Message_message
      }
    }
  }
`;

export { MessageAdded };
