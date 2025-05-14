import {
  usePaginationFragment,
  usePreloadedQuery,
  type PreloadedQuery,
} from "react-relay";

import {
  AccountFragment,
  AccountsQueryFragment,
  columns as accountsColumns,
} from "@/graphql/fragments/Account";
import {
  columns as transactionsColumns,
  TransactionFragment,
  TransactionsQueryFragment,
} from "@/graphql/fragments/Transaction";
import type { AccountsQuery as AccountsQueryType } from "@/__generated__/AccountsQuery.graphql";
import type { TransactionsQuery as TransactionsQueryType } from "@/__generated__/TransactionsQuery.graphql";
import { useReducer, useState } from "react";
import { TabSwitcher, type Option } from "./TabSwitcher";
import { AccountsQuery } from "@/graphql/queries/AccountsQuery";
import { TransactionsQuery } from "@/graphql/queries/Transactions";
import { DataTable } from "./DataTable";
import { useAccountAddedSubscription } from "@/graphql/subscriptions/useAccountAddedSubscription";
import { useTransactionAddedSubscription } from "@/graphql/subscriptions/useTransactionAddedSubscription";

type HomePageDataTableProps = {
  queryRefs: {
    Accounts: PreloadedQuery<AccountsQueryType>;
    Transactions: PreloadedQuery<TransactionsQueryType>;
  };
};

export const HomePageDataTable = ({ queryRefs }: HomePageDataTableProps) => {
  const [menu, setMenu] = useState("Accounts");
  const options: Option[] = [
    { id: "Accounts", label: "Accounts", action: (id) => setMenu(id) },
    { id: "Transactions", label: "Transactions", action: (id) => setMenu(id) },
  ];
  const [newItems, setNewItems] = useState({ Accounts: 0, Transctions: 0 });

  const preloadedAccountQuery = usePreloadedQuery(
    AccountsQuery,
    queryRefs.Accounts,
  );
  const preloadedTransactionQuery = usePreloadedQuery(
    TransactionsQuery,
    queryRefs.Transactions,
  );

  const { data: rawAccounts, ...accountsPagination } = usePaginationFragment(
    AccountsQueryFragment,
    preloadedAccountQuery,
  );

  const { data: rawTransactions, ...transactionsPagination } =
    usePaginationFragment(TransactionsQueryFragment, preloadedTransactionQuery);

  const accounts = rawAccounts.accounts;
  const transactions = rawTransactions.transactions;
  const state = {
    Accounts: {
      __id: accounts.__id,
      data: accounts.edges.map(({ node }) => node),
      rowCount: accounts.totalCount,
      columns: accountsColumns,
      fragment: AccountFragment,
      ...accountsPagination,
    },
    Transactions: {
      __id: transactions.__id,
      data: transactions.edges.map(({ node }) => node),
      rowCount: transactions.totalCount,
      columns: transactionsColumns,
      fragment: TransactionFragment,
      ...transactionsPagination,
    },
  };

  useAccountAddedSubscription(
    {
      connections: [state.Accounts.__id],
      input: {},
    },
    {
      onNext(data) {
        setNewItems({ ...newItems, Accounts: newItems.Accounts + 1 });
      },
    },
  );

  useTransactionAddedSubscription(
    {
      connections: [state.Transactions.__id],
      input: {},
    },
    {
      onNext(data) {
        setNewItems({ ...newItems, Transctions: newItems.Transctions + 1 });
      },
    },
  );

  return (
    <div className="flex flex-col gap-2">
      <TabSwitcher active={menu} options={options} onChange={() => {}} />

      <DataTable
        data={state[menu].data}
        columns={state[menu].columns}
        rowCount={state[menu].rowCount || 0 + newItems[menu]}
        loadNext={state[menu].loadNext}
        fragment={state[menu].fragment}
      />
    </div>
  );
};
