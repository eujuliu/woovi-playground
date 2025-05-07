import {
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu';
import { getColumn } from '@/utils/getColumn';
import { ColumnDef } from '@tanstack/react-table';
import { graphql } from 'relay-runtime';

export type IAccount = {
	id: string;
	name: string;
	balance: number;
	createdAt: string;
};

export const AccountsQueryFragment = graphql`
	fragment AccountsQueryFragment on Query
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 0 }
		after: { type: "String", defaultValue: null }
		last: { type: "Int", defaultValue: null }
		before: { type: "String", defaultValue: null }
	)
	@refetchable(queryName: "AccountsRefetchQuery") {
		accounts(first: $first, after: $after, before: $before, last: $last)
			@connection(key: "AccountsQueryFragment_accounts") {
			edges {
				node {
					id
					name
					balance
					createdAt
				}
			}
			totalCount
		}
	}
`;

export const columns: ColumnDef<IAccount>[] = [
	getColumn('id'),
	{
		id: 'name',
		accessorKey: 'name',
		header: 'Name',
	},
	{
		id: 'balance',
		accessorKey: 'balance',
		header: 'Balance',
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('balance'));
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
				Copy Account ID
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem>Deposit</DropdownMenuItem>
			<DropdownMenuItem>Transactions</DropdownMenuItem>
		</>
	)),
];
