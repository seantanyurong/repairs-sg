import { ColumnDef } from "@tanstack/react-table";
import { EditCell } from "./EditableTable/EditCell";
import { EditableTableCell } from "./EditableTable/EditableTableCell";

export interface LineItem {
  description: string;
  quantity: number;
  total: number;
}

export const lineItemColumns: ColumnDef<LineItem>[] = [
  {
    accessorKey: "description",
    header: "Description",
    cell: EditableTableCell,
    size: 400,
    meta: {
      type: "text",
      required: true,
      validationMessage: "Description is required",
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: EditableTableCell,
    size: 75,
    meta: {
      type: "number",
      required: true,
      validationMessage: "Quantity is required",
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: EditableTableCell,
    size: 75,
    meta: {
      type: "number",
      required: true,
      validationMessage: "Total is required",
    },
  },
  {
    header: "Edit",
    size: 75,
    cell: EditCell,
  },
];
