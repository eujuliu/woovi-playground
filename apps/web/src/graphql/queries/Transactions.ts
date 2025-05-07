import { graphql } from 'relay-runtime';

export const TransactionsQuery = graphql`
	query TransactionsQuery {
		...TransactionsQueryFragment
	}
`;
