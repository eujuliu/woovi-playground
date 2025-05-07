import {
	PreloadedQuery,
	usePaginationFragment,
	usePreloadedQuery,
} from 'react-relay';
import { DataTable } from './DataTable';

import {
	AccountsQueryFragment,
	columns as accountColumns,
} from '@/graphql/fragments/Account';
import {
	TransactionsQueryFragment,
	columns as transactionsColumns,
} from '@/graphql/fragments/Transaction';

import AccountsQuery, {
	AccountsQuery as AccountsQueryType,
} from '@/__generated__/AccountsQuery.graphql';
import TransactionsQuery, {
	TransactionsQuery as TransactionsQueryType,
} from '@/__generated__/TransactionsQuery.graphql';
import { useState } from 'react';
import { Option, TabSwitcher } from './TabSwitcher';
import { AccountsRefetchQuery } from '@/__generated__/AccountsRefetchQuery.graphql';
import { AccountsQueryFragment$key } from '@/__generated__/AccountsQueryFragment.graphql';
import { TransactionsRefetchQuery } from '@/__generated__/TransactionsRefetchQuery.graphql';
import { TransactionsQueryFragment$key } from '@/__generated__/TransactionsQueryFragment.graphql';

type HomePageDataTableProps = {
	queryRefs: {
		Accounts: PreloadedQuery<AccountsQueryType>;
		Transactions: PreloadedQuery<TransactionsQueryType>;
	};
};

type PaginationComponentProps = {
	preloadedQuery: any;
};

const Accounts = ({ preloadedQuery }: PaginationComponentProps) => {
	const { data, isLoadingNext, loadNext } = usePaginationFragment<
		AccountsRefetchQuery,
		AccountsQueryFragment$key
	>(AccountsQueryFragment, preloadedQuery);

	const items = data.accounts.edges.map(({ node }) => node);
	const rowCount = data.accounts.totalCount;

	return (
		<DataTable
			columns={accountColumns}
			data={items}
			loadNext={loadNext}
			loading={isLoadingNext}
			rowCount={rowCount}
		/>
	);
};

const Transactions = ({ preloadedQuery }: PaginationComponentProps) => {
	const { data, isLoadingNext, loadNext } = usePaginationFragment<
		TransactionsRefetchQuery,
		TransactionsQueryFragment$key
	>(TransactionsQueryFragment, preloadedQuery);

	const items = data.transactions.edges.map(({ node }) => node);
	const rowCount = data.transactions.totalCount;
	return (
		<DataTable
			columns={transactionsColumns}
			data={items}
			loadNext={loadNext}
			loading={isLoadingNext}
			rowCount={rowCount}
		/>
	);
};

export const HomePageDataTable = ({ queryRefs }: HomePageDataTableProps) => {
	const [menu, setMenu] = useState('Accounts');
	const options: Option[] = [
		{ id: 'Accounts', label: 'Accounts', action: (id) => setMenu(id) },
		{ id: 'Transactions', label: 'Transactions', action: (id) => setMenu(id) },
	];

	const queries = {
		AccountsQuery,
		TransactionsQuery,
	};

	const preloadedQuery = usePreloadedQuery(
		queries[`${menu}Query`],
		queryRefs[menu]
	);

	function getDataTable(type: string) {
		switch (type) {
			case 'Accounts':
				return <Accounts preloadedQuery={preloadedQuery} />;
			case 'Transactions':
				return <Transactions preloadedQuery={preloadedQuery} />;
			default:
				return <div>The menus available are Accounts, Transactions</div>;
		}
	}

	return (
		<div className="flex flex-col gap-2">
			<TabSwitcher active={menu} options={options} />

			{getDataTable(menu)}
		</div>
	);
};
