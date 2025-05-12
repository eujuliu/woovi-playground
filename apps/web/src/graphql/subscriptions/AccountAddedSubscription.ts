import { graphql } from "react-relay";

const AccountAdded = graphql`
  subscription AccountAddedSubscription(
    $input: AccountAddedInput!
    $connections: [ID!]!
  ) {
    AccountAdded(input: $input) {
      account
        @appendNode(connections: $connections, edgeTypeName: "AccountEdge") {
        id
        ...AccountFragment
      }
    }
  }
`;

export { AccountAdded };
