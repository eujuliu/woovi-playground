import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontalIcon } from 'lucide-react';
import { ReactNode } from 'react';

export function getColumn<TData, TValue>(
	name: 'id' | 'date' | 'actions',
	options?: ColumnDef<TData, TValue>,
	DropdownContent?: (data: Row<any>) => ReactNode
): ColumnDef<TData, TValue> {
	switch (name) {
		case 'id':
			return {
				id: 'id',
				accessorKey: 'id',
				header: 'ID',
			};
		case 'actions':
			if (!DropdownContent)
				throw new Error('DropdownContent is required for actions');
			return {
				id: 'actions',
				cell: ({ row }) => (
					<DropdownMenu>
						<DropdownMenuTrigger className="flex justify-center items-center cursor-pointer hover:bg-neutral-100 rounded-md h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontalIcon className="h-4 w-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{DropdownContent(row)}
						</DropdownMenuContent>
					</DropdownMenu>
				),
			};
		case 'date':
			if (!options) throw new Error('Options is required for date');
			return {
				...options,
				cell: ({ row }) => {
					const createdAt = new Date(row.getValue('createdAt'));
					const date = createdAt.toLocaleDateString('en-US', {
						dateStyle: 'medium',
					});
					const time = createdAt.toLocaleTimeString('en-US', {
						timeStyle: 'short',
					});

					return <>{`${date} ${time}`}</>;
				},
			};
		default:
			return;
	}
}
