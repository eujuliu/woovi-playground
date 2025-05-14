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

export type ITransaction = {
  id: string;
  type: "DEPOSIT" | "TRANSFER";
  from: string;
  to: string;
  amount: number;
  createdAt: string;
};

export const TransactionFragment = graphql`
  fragment TransactionFragment on Transaction {
    id
    type
    from
    to
    amount
    createdAt
  }
`;

export const TransactionsQueryFragment = graphql`
  fragment TransactionsQueryFragment on Query
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 10 }
    after: { type: "String", defaultValue: null }
  )
  @refetchable(queryName: "TransactionsRefetchQuery") {
    transactions(first: $first, after: $after)
      @connection(key: "TransactionsQueryFragment_transactions") {
      __id
      edges {
        node {
          id
          type
          from
          to
          amount
          createdAt
          ...TransactionFragment
        }
      }
      totalCount
    }
  }
`;

export const columns: Column<ITransaction>[] = [
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
    id: "type",
    accessorKey: "type",
    canSort: true,
    header: "Type",
    cell: (data) => data.type,
  },
  {
    id: "from",
    accessorKey: "from",
    canSort: true,
    header: "From",
    cell: (data) => (
      <button
        type="button"
        className="bg-neutral-200 rounded-md px-1 font-medium"
        title="Copy Id"
        onClick={() => navigator.clipboard.writeText(data.from)}
      >
        {data.from}
      </button>
    ),
  },
  {
    id: "to",
    accessorKey: "to",
    canSort: true,
    header: "To",
    cell: (data) => (
      <button
        type="button"
        className="bg-neutral-200 rounded-md px-1 font-medium"
        title="Copy Id"
        onClick={() => navigator.clipboard.writeText(data.to)}
      >
        {data.to}
      </button>
    ),
  },
  {
    id: "amount",
    accessorKey: "amount",
    canSort: true,
    header: "Amount",
    cell: (data) => convertNumberToMoney(data.amount.toString()),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    canSort: true,
    header: "Created At",
    cell: (data) => data.createdAt,
  },
];
