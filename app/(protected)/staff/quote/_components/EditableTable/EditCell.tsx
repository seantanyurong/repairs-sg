import { Button } from "@/components/ui/button";
import { Row, Table } from "@tanstack/react-table";
import { Check, Pencil, X } from "lucide-react";
import { MouseEvent } from "react";

interface EditCellProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

export const EditCell = <TData,>({ row, table }: EditCellProps<TData>) => {
  const meta = table.options.meta;
  const validRow = meta?.validRows[row.id];
  const disableSubmit = validRow
    ? Object.values(validRow)?.some((item) => !item)
    : false;

  const setEditedRows = (e: MouseEvent<HTMLButtonElement>) => {
    const elName = e.currentTarget.name;
    meta?.setEditedRows((old: { [key: string]: boolean }) => ({
      ...old,
      [row.id]: !old[row.id],
    }));
    if (elName !== "edit") {
      meta?.revertData(row.index, e.currentTarget.name === "cancel");
    }
  };

  const removeRow = () => {
    meta?.removeRow(row.index);
  };

  return (
    <div className="flex justify-end items-center gap-4">
      {meta?.editedRows[row.id] ? (
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={setEditedRows}
            variant="outline"
            size="icon"
            disabled={disableSubmit}
            name="done"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={setEditedRows}
            variant="outline"
            size="icon"
            name="cancel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={setEditedRows}
            variant="outline"
            size="icon"
            name="edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            onClick={removeRow}
            variant="destructive"
            size="icon"
            name="remove"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
