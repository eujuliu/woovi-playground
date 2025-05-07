import { graphql } from 'relay-runtime';

export const MessageFragment = graphql`
	fragment Message_message on Message {
		content
		createdAt
	}
`;
