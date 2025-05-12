import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import { getColumn } from "@/utils/getColumn";
import type { ColumnDef } from "@tanstack/react-table";
import { graphql } from "relay-runtime";
import { convertNumberToMoney } from "@/helpers";

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
    first: { type: "Int", defaultValue: 20 }
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
        }
      }
      totalCount
    }
  }
`;

export const columns: ColumnDef<ITransaction>[] = [
  getColumn("id"),
  {
    id: "type",
    accessorKey: "type",
    header: "Type",
  },
  {
    id: "from",
    accessorKey: "from",
    header: "From",
  },
  {
    id: "to",
    accessorKey: "to",
    header: "To",
  },
  {
    id: "amount",
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <>{convertNumberToMoney(row.getValue("amount"))}</>,
  },
  getColumn("date", {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At",
  }),
  getColumn("actions", null, (row) => (
    <>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem
        onClick={() => navigator.clipboard.writeText(row.original.id)}
      >
        Copy Transaction ID
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => navigator.clipboard.writeText(row.original.from)}
      >
        Copy Sender ID
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => navigator.clipboard.writeText(row.original.to)}
      >
        Copy Receiver ID
      </DropdownMenuItem>
    </>
  )),
];
