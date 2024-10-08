import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const FooterCell = ({ table }) => {
  const meta = table.options.meta;
  const selectedRows = table.getSelectedRowModel().rows;

  const removeRows = () => {
    meta.removeSelectedRows(
      table
        .getSelectedRowModel()
        .rows.map((row: { index: number }) => row.index)
    );
    table.resetRowSelection();
  };

  return (
    <div className="footer-buttons">
      {selectedRows.length > 0 ? (
        <Button
          className="remove-button"
          onClick={removeRows}
        >
          Remove Selected x
        </Button>
      ) : null}
      <Button
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
