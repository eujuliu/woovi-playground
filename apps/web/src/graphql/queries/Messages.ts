import { graphql } from 'relay-runtime';

export const MessagesQuery = graphql`
	query MessagesQuery($first: Int!, $after: String) {
		messages(first: $first, after: $after) @connection(key: "Chat_messages") {
			__id
			edges {
				node {
					id
					content
					createdAt
					...Message_message
				}
			}
		}
	}
`;
