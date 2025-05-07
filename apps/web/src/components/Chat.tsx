import { Message } from '../components/Message';
import { Layout } from '../components/Layout';
import { MessageList } from '../components/MessageList';
import { PreloadedQuery, usePreloadedQuery } from 'react-relay';
import { MessagesQuery as GQLMessageQuery } from '../__generated__/MessagesQuery.graphql';
import { useMessageAddedSubscription } from '../graphql/subscriptions/useMessageAddedSubscription';
import { MessagesQuery } from '../graphql/queries/Messages';

type Props = {
	messageQueryRef: PreloadedQuery<GQLMessageQuery>;
};

export const Chat = ({ messageQueryRef }: Props) => {
	const data = usePreloadedQuery<GQLMessageQuery>(
		MessagesQuery,
		messageQueryRef
	);

	useMessageAddedSubscription({
		connections: [data.messages?.__id],
		input: {},
	});

	return (
		<Layout>
			<MessageList>
				{data.messages.edges.map(({ node }) => (
					<Message key={node.id} message={node} />
				))}
			</MessageList>
		</Layout>
	);
};
