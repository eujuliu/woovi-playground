import {
  usePaginationFragment,
  usePreloadedQuery,
  type LoadMoreFn,
  type PreloadedQuery,
  type RefetchFnDynamic,
} from "react-relay";
import { DataTable } from "./DataTable";

import {
  AccountsQueryFragment,
  columns as accountsColumns,
} from "@/graphql/fragments/Account";
import {
  columns as transactionsColumns,
  TransactionsQueryFragment,
} from "@/graphql/fragments/Transaction";

import type { AccountsQuery as AccountsQueryType } from "@/__generated__/AccountsQuery.graphql";
import type { TransactionsQuery as TransactionsQueryType } from "@/__generated__/TransactionsQuery.graphql";
import { useState } from "react";
import { OperationType } from "relay-runtime";
import { TabSwitcher, type Option } from "./TabSwitcher";
import { AccountsQuery } from "@/graphql/queries/AccountsQuery";
import { TransactionsQuery } from "@/graphql/queries/Transactions";
import type { ColumnDef } from "@tanstack/react-table";

type HomePageDataTableProps = {
  queryRefs: {
    Accounts: PreloadedQuery<AccountsQueryType>;
    Transactions: PreloadedQuery<TransactionsQueryType>;
  };
};

type Pagination = {
  __id: string;
  data: Array<Record<string, unknown>>;
  loadNext: LoadMoreFn<OperationType>;
  loadPrevious: LoadMoreFn<OperationType>;
  hasNext: boolean;
  hasPrevious: boolean;
  isLoadingNext: boolean;
  isLoadingPrevious: boolean;
  refetch: RefetchFnDynamic<OperationType, any>;
  rowCount: number;
  columns: ColumnDef<any>[];
};

const extra = {
  Accounts: {
    query: AccountsQuery,
    fragmentQuery: AccountsQueryFragment,
    columns: accountsColumns,
  },
  Transactions: {
    query: TransactionsQuery,
    fragmentQuery: TransactionsQueryFragment,
    columns: transactionsColumns,
  },
};

export const HomePageDataTable = ({ queryRefs }: HomePageDataTableProps) => {
  const [menu, setMenu] = useState("Accounts");
  const options: Option[] = [
    { id: "Accounts", label: "Accounts", action: (id) => setMenu(id) },
    { id: "Transactions", label: "Transactions", action: (id) => setMenu(id) },
  ];
  const pagination = options.reduce<Record<string, Pagination>>(
    (acc, { id }) => {
      const { query, fragmentQuery, subscription, columns } = extra[id];
      const preloadedQuery = usePreloadedQuery(query, queryRefs[id]);

      const { data: raw, ...pagination } = usePaginationFragment(
        fragmentQuery,
        preloadedQuery,
      );

      const data = raw[id.toLowerCase()];

      acc[id] = {
        __id: data.__id,
        data: data.edges.map(({ node }) => node),
        rowCount: data.totalCount,
        columns,
        ...pagination,
      };

      return acc;
    },
    {},
  );

  return (
    <div className="flex flex-col gap-2">
      <TabSwitcher active={menu} options={options} />

      <DataTable
        columns={pagination[menu].columns}
        data={pagination[menu].data}
        loadNext={pagination[menu].loadNext}
        loading={pagination[menu].isLoadingNext}
        rowCount={pagination[menu].rowCount}
      />
    </div>
  );
};
