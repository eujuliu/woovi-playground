import { Button } from "@/components/ui/Button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export default function formatColumns<TData, TValue>(
  columns: ColumnDef<TData, TValue>[],
): ColumnDef<TData, TValue>[] {
  const exclude = ["id", "actions"];
  return columns.reduce((acc, col) => {
    acc.push({
      ...col,
      header: !exclude.includes(col.id)
        ? ({ column }) => {
            return (
              <Button
                variant="ghost"
                className="text-xs font-medium cursor-pointer"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                <>
                  {col.header}
                  <ArrowUpDown className="ml-2 h-2 w-2" />
                </>
              </Button>
            );
          }
        : col.header,
    });

    return acc;
  }, []);
}
