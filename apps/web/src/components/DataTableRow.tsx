import { DateTime } from "luxon";
import { useFragment } from "react-relay";
import type { Column } from "./DataTable";
import { TableCell, TableRow } from "./ui/Table";

export type DataTableRowProps<T> = {
  fragment: any;
  node: any;
  columns: Column<T>[];
};

export const DataTableRow = <T extends object>({
  fragment,
  node,
  columns,
}: DataTableRowProps<T>) => {
  const data = useFragment(fragment, node);

  return (
    <TableRow>
      {columns.map(({ id, cell }) => {
        return <TableCell key={id}>{cell({ ...data })}</TableCell>;
      })}
    </TableRow>
  );
};
