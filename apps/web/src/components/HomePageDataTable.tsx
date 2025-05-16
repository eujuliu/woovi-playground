import {
  usePaginationFragment,
  usePreloadedQuery,
  type GraphQLTaggedNode,
  type PreloadedQuery,
} from "react-relay";

import {
  AccountFragment,
  AccountsQueryFragment,
  columns as accountsColumns,
  type IAccount,
} from "@/graphql/fragments/Account";
import {
  columns as transactionsColumns,
  TransactionFragment,
  TransactionsQueryFragment,
  type ITransaction,
} from "@/graphql/fragments/Transaction";
import { AccountsQuery } from "@/graphql/queries/AccountsQuery";
import { TransactionsQuery } from "@/graphql/queries/Transactions";
import { useAccountAddedSubscription } from "@/graphql/subscriptions/useAccountAddedSubscription";
import { useTransactionAddedSubscription } from "@/graphql/subscriptions/useTransactionAddedSubscription";
import type {
  AccountsQuery as AccountsQueryType,
  AccountsQuery$data,
} from "@/__generated__/AccountsQuery.graphql";
import type {
  TransactionsQuery as TransactionsQueryType,
  TransactionsQuery$data,
} from "@/__generated__/TransactionsQuery.graphql";
import { useState } from "react";
import type { usePaginationFragmentHookType } from "react-relay/relay-hooks/usePaginationFragment";
import { DataTable, type Column } from "./DataTable";
import { TabSwitcher, type Option } from "./TabSwitcher";
import { Refresh } from "./ui/Refresh";
import { toast } from "sonner";
import { DateTime } from "luxon";

type HomePageDataTableProps = {
  queryRefs: {
    Accounts: PreloadedQuery<AccountsQueryType>;
    Transactions: PreloadedQuery<TransactionsQueryType>;
  };
};

type State = {
  __id: string;
  data: AccountsQuery$data | TransactionsQuery$data[];
  rowCount: number;
  columns: Column<IAccount | ITransaction>[];
  fragment: GraphQLTaggedNode;
} & usePaginationFragmentHookType<any, any, any>;

type Menus = "Accounts" | "Transactions";

export const HomePageDataTable = ({ queryRefs }: HomePageDataTableProps) => {
  const [menu, setMenu] = useState<Menus>("Accounts");
  const options: Option[] = [
    { id: "Accounts", label: "Accounts", action: (id) => setMenu(id as Menus) },
    {
      id: "Transactions",
      label: "Transactions",
      action: (id) => setMenu(id as Menus),
    },
  ];

  const preloadedAccountQuery = usePreloadedQuery<AccountsQueryType>(
    AccountsQuery,
    queryRefs.Accounts,
  );
  const preloadedTransactionQuery = usePreloadedQuery<TransactionsQueryType>(
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

  const state: Record<"Accounts" | "Transactions", State> = {
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
        const account = data.AccountAdded.account;
        toast("Account added", {
          description: `Account ${account.id} created at ${DateTime.fromISO(account.createdAt).toFormat("dd/MM/yyyy HH:mm")}`,
          position: "top-right",
        });
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
        const transaction = data.TransactionAdded.transaction;
        toast("Transaction added", {
          description: `New ${transaction.type} from ${transaction.from} to ${transaction.to} at ${DateTime.fromISO(transaction.createdAt).toFormat("dd/MM/yyyy HH:mm")}`,
          position: "top-right",
        });
      },
    },
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <TabSwitcher active={menu} options={options} />

        <Refresh
          loading={false}
          onClick={() =>
            state[menu].refetch({
              first: 20,
              after: null,
            })
          }
        />
      </div>

      <DataTable
        data={state[menu].data}
        columns={state[menu].columns}
        rowCount={state[menu].rowCount}
        loadNext={state[menu].loadNext}
        loading={state[menu].isLoadingNext}
        fragment={state[menu].fragment}
        type={menu}
      />
    </div>
  );
};
