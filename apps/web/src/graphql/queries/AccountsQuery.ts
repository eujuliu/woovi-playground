import { graphql } from "relay-runtime";

export const AccountsQuery = graphql`
  query AccountsQuery {
    ...AccountsQueryFragment
  }
`;
