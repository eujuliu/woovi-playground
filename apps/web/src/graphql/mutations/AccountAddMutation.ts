import { graphql } from 'react-relay';

export const AccountAdd = graphql`
	mutation AccountAddMutation($input: AccountAddInput!) {
		AccountAdd(input: $input) {
			account {
				id
				name
				balance
				createdAt
			}
		}
	}
`;
