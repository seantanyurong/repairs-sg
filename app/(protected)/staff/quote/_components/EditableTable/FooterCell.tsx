import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";

export const FooterCell = <TData,>({ table }: { table: Table<TData> }) => {
  const meta = table.options.meta;
  const selectedRows = table.getSelectedRowModel().rows;

  const removeRows = () => {
    if (meta) {
      meta.removeSelectedRows(
        table
          .getSelectedRowModel()
          .rows.map((row: { index: number }) => row.index)
      );
    }
    table.resetRowSelection();
  };

  return (
    <div className="footer-buttons">
      {selectedRows.length > 0 ? (
        <Button
          type="button"
          className="remove-button"
          onClick={removeRows}
        >
          Remove Selected x
        </Button>
      ) : null}
      <Button
        type="button"
        className="h-8 gap-1"
        onClick={meta?.addRow}
        variant="outline"
      >
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add New
        </span>
      </Button>
    </div>
  );
};
