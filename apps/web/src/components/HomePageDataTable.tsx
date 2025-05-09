import {
  usePaginationFragment,
  usePreloadedQuery,
  type PreloadedQuery,
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

import AccountsQuery, {
  type AccountsQuery as AccountsQueryType,
} from "@/__generated__/AccountsQuery.graphql";
import TransactionsQuery, {
  type TransactionsQuery as TransactionsQueryType,
} from "@/__generated__/TransactionsQuery.graphql";
import { useState } from "react";
import { TabSwitcher, type Option } from "./TabSwitcher";

type HomePageDataTableProps = {
  queryRefs: {
    Accounts: PreloadedQuery<AccountsQueryType>;
    Transactions: PreloadedQuery<TransactionsQueryType>;
  };
};

const queries = {
  TransactionsQuery,
  TransactionsQueryFragment,
  AccountsQuery,
  AccountsQueryFragment,
};

const columns = {
  accountsColumns,
  transactionsColumns,
};

export const HomePageDataTable = ({ queryRefs }: HomePageDataTableProps) => {
  const [menu, setMenu] = useState("Accounts");
  const options: Option[] = [
    { id: "Accounts", label: "Accounts", action: (id) => setMenu(id) },
    { id: "Transactions", label: "Transactions", action: (id) => setMenu(id) },
  ];
  const pagination = options.reduce((acc, { id }) => {
    const preloadedQuery = usePreloadedQuery(
      queries[`${id}Query`],
      queryRefs[id],
    );
    const { data, ...pagination } = usePaginationFragment(
      queries[`${id}QueryFragment`],
      preloadedQuery,
    );

    acc[id] = {
      data: data[id.toLowerCase()].edges.map(({ node }) => node),
      rowCount: data[id.toLowerCase()].totalCount,
      columns: columns[`${id.toLowerCase()}Columns`],
      ...pagination,
    };

    return acc;
  }, {});

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
