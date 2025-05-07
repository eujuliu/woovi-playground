import {
	DropdownMenuItem,
	DropdownMenuLabel,
} from '@/components/ui/DropdownMenu';
import { getColumn } from '@/utils/getColumn';
import { ColumnDef } from '@tanstack/react-table';
import { graphql } from 'relay-runtime';

export type ITransaction = {
	id: string;
	type: string;
	from: string;
	to: string;
	amount: number;
	createdAt: string;
};

export const TransactionsQueryFragment = graphql`
	fragment TransactionsQueryFragment on Query
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 0 }
		after: { type: "String", defaultValue: null }
		last: { type: "Int", defaultValue: null }
		before: { type: "String", defaultValue: null }
	)
	@refetchable(queryName: "TransactionsRefetchQuery") {
		transactions(first: $first, after: $after, before: $before, last: $last)
			@connection(key: "TransactionsQueryFragment_transactions") {
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
	getColumn('id'),
	{
		id: 'type',
		accessorKey: 'type',
		header: 'Type',
	},
	{
		id: 'from',
		accessorKey: 'from',
		header: 'From',
	},
	{
		id: 'to',
		accessorKey: 'to',
		header: 'To',
	},
	{
		id: 'amount',
		accessorKey: 'amount',
		header: 'Amount',
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('amount'));
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(amount);

			return <>{formatted}</>;
		},
	},
	getColumn('date', {
		id: 'createdAt',
		accessorKey: 'createdAt',
		header: 'Created At',
	}),
	getColumn('actions', null, (row) => (
		<>
			<DropdownMenuLabel>Actions</DropdownMenuLabel>
			<DropdownMenuItem
				onClick={() => navigator.clipboard.writeText(row.original.id)}
			>
				Copy Transaction ID
			</DropdownMenuItem>
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
