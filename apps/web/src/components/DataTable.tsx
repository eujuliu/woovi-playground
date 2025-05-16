import { chunkArray, chunkNumber, sortByKey, type SortType } from "@/helpers";
import { ArrowDown, ArrowUp, ArrowUpDown, LoaderCircle } from "lucide-react";
import { type ReactNode, useState, useEffect } from "react";
import type { LoadMoreFn } from "react-relay";
import type { OperationType } from "relay-runtime";
import { DataTableRow } from "./DataTableRow";
import { Button } from "./ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";

export type Data = {
  id: string;
  [key: string]: unknown;
};

export type Column<T> = {
  id: string;
  accessorKey?: string;
  order?: number;
  header?: string;
  canSort: boolean;
  cell: (data: T) => ReactNode;
};

export type Sorting = {
  type: SortType;
  column: string;
};

export type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  rowCount: number;
  loadNext: LoadMoreFn<OperationType>;
  fragment: any;
  itemsPerPage?: number;
  loading: boolean;
  type?: string;
};

export const DataTable = <T extends Data>({
  data: raw,
  columns,
  rowCount,
  loadNext,
  loading,
  fragment,
  itemsPerPage = 10,
  type,
}: DataTableProps<T>) => {
  const [sorting, setSorting] = useState<Sorting>({
    column: "createdAt",
    type: "dec",
  });
  const [pageIndex, setPageIndex] = useState(0);
  const chunksCount = chunkNumber(rowCount, itemsPerPage);
  const pagesCount = chunksCount.length;
  const chunks = chunkArray(
    sortByKey(raw, sorting.column, sorting.type as "asc" | "dec"),
    itemsPerPage,
  );
  const data = chunks[pageIndex];

  useEffect(() => {
    setPageIndex(0);
    setSorting({ ...sorting, column: "createdAt" });
  }, [type]);

  function sortArrow(active: boolean, type: "asc" | "dec") {
    if (!active) return <ArrowUpDown className="ml-2 h-2 w-2" />;

    if (type === "asc") return <ArrowUp className="ml-2 h-2 w-2" />;

    return <ArrowDown className="ml-2 h-2 w-2" />;
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>
                  {column.canSort ? (
                    <Button
                      variant="ghost"
                      className={`text-xs font-medium cursor-pointer hover:bg-[#113463] hover:text-white transition duration-400 h-7 ${sorting.column === column.id ? "bg-[#133a6f] text-white" : ""}`}
                      onClick={() =>
                        setSorting({
                          column: column.id,
                          type: sorting.type === "asc" ? "dec" : "asc",
                        })
                      }
                    >
                      {column.header}
                      {sortArrow(sorting.column === column.id, sorting.type)}
                    </Button>
                  ) : (
                    <div className="text-xs font-medium">{column.header}</div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.length ? (
              data.map((row) => (
                <DataTableRow
                  key={row.id}
                  fragment={fragment}
                  node={row}
                  columns={columns}
                />
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
        <span className="text-sm text-neutral-800">Count {rowCount}</span>
        <span className="text-sm text-neutral-800">
          {`Page ${pageIndex + 1} of ${pagesCount}`}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => {
            if (chunks[pageIndex + 1]?.length === chunksCount[pageIndex + 1])
              return setPageIndex(pageIndex + 1);

            loadNext(10, {
              onComplete() {
                setPageIndex(pageIndex + 1);
              },
            });
          }}
          disabled={pageIndex === pagesCount - 1}
        >
          {loading ? <LoaderCircle className="animate-spin" /> : "Next"}
        </Button>
      </div>
    </div>
  );
};
