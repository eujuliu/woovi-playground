import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import { getColumn } from "@/utils/getColumn";
import type { ColumnDef } from "@tanstack/react-table";
import { graphql } from "relay-runtime";
import { convertNumberToMoney } from "@/helpers";
import { Column } from "@/components/DataTable";

export type IAccount = {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
};

export const AccountFragment = graphql`
  fragment AccountFragment on Account {
    id
    name
    balance
    createdAt
  }
`;

export const AccountsQueryFragment = graphql`
  fragment AccountsQueryFragment on Query
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 10 }
    after: { type: "String", defaultValue: null }
  )
  @refetchable(queryName: "AccountsRefetchQuery") {
    accounts(first: $first, after: $after)
      @connection(key: "AccountsQueryFragment_accounts") {
      __id
      edges {
        node {
          id
          name
          balance
          createdAt
          ...AccountFragment
        }
      }
      totalCount
    }
  }
`;

export const columns: Column<IAccount>[] = [
  {
    id: "id",
    accessorKey: "id",
    canSort: false,
    header: "ID",
    cell: (data) => (
      <button
        type="button"
        className="bg-neutral-200 rounded-md px-1 font-medium"
        title="Copy Id"
        onClick={() => navigator.clipboard.writeText(data.id)}
      >
        {data.id}
      </button>
    ),
  },
  {
    id: "name",
    accessorKey: "name",
    canSort: true,
    header: "Name",
    cell: (data) => data.name,
  },
  {
    id: "balance",
    accessorKey: "balance",
    canSort: true,
    header: "Balance",
    cell: (data) => convertNumberToMoney(data.balance),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    canSort: true,
    header: "Created At",
    cell: (data) => data.createdAt,
  },
];
