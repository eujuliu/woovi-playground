import { graphql } from 'react-relay';

export const TransactionAdd = graphql`
	mutation TransactionAddMutation($input: TransactionAddInput!) {
		TransactionAdd(input: $input) {
			transaction {
				id
				type
				from
				to
				amount
				createdAt
			}
		}
	}
`;
