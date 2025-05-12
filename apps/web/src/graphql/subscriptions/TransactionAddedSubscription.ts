import { graphql } from "react-relay";

const TransactionAdded = graphql`
  subscription TransactionAddedSubscription(
    $input: TransactionAddedInput!
    $connections: [ID!]!
  ) {
    TransactionAdded(input: $input) {
      transaction
        @appendNode(
          connections: $connections
          edgeTypeName: "TransactionEdge"
        ) {
        id
        ...TransactionFragment
      }
    }
  }
`;

export { TransactionAdded };
