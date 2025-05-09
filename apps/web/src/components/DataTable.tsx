import formatColumns from "@/utils/formatColumns";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "./ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";

export type DataTableProps<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  rowCount: number;
  loadNext: (count: number, options?: unknown) => void;
  loading: boolean;
};

export const DataTable = <TData, TValue>({
  data,
  columns,
  rowCount,
  loadNext,
  loading,
}: DataTableProps<TData, TValue>) => {
  const [loadedPages, setLoadedPages] = useState([1]);
  const formattedColumns = useMemo(() => formatColumns(columns), [columns]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns: formattedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    rowCount,
    state: {
      sorting,
    },
  });

  function handleLoadNext(count: number) {
    const nextPageIndex = table.getState().pagination.pageIndex + 2;

    if (!loadedPages.includes(nextPageIndex)) {
      loadNext(count, {
        onComplete(arg) {
          setLoadedPages([...loadedPages, nextPageIndex]);
          setTimeout(() => table.nextPage(), 100);
        },
      });

      return;
    }

    table.nextPage();
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="text-sm text-neutral-800">
          {`Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || loading}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => handleLoadNext(10)}
          disabled={!table.getCanNextPage() || loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
