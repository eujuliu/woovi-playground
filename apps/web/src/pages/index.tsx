import { HomePageDataTable } from '@/components/HomePageDataTable';
import AccountsQuery, {
	AccountsQuery as AccountsQueryType,
} from '@/__generated__/AccountsQuery.graphql';
import TransactionsQuery, {
	TransactionsQuery as TransactionsQueryType,
} from '@/__generated__/TransactionsQuery.graphql';
import { GetServerSideProps } from 'next';
import { getPreloadedQuery } from '@/relay/network';
import { PreloadedQuery } from 'react-relay';

type IndexProps = {
	queryRefs: {
		Accounts: PreloadedQuery<AccountsQueryType>;
		Transactions: PreloadedQuery<TransactionsQueryType>;
	};
};

const Index = ({ queryRefs }: IndexProps) => {
	return (
		<div className="p-4">
			<HomePageDataTable queryRefs={queryRefs} />
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	return {
		props: {
			preloadedQueries: {
				Accounts: await getPreloadedQuery(AccountsQuery, {
					first: 10,
					after: null,
				}),
				Transactions: await getPreloadedQuery(TransactionsQuery, {
					first: 0,
					after: null,
				}),
			},
		},
	};
};

export default Index;
