import { graphql } from "react-relay";

const AccountAdded = graphql`
  subscription AccountAddedSubscription(
    $input: AccountAddedInput!
    $connections: [ID!]!
  ) {
    AccountAdded(input: $input) {
      account
        @prependNode(connections: $connections, edgeTypeName: "AccountEdge") {
        id
        name
        balance
        createdAt
        ...AccountFragment
      }
    }
  }
`;

export { AccountAdded };
