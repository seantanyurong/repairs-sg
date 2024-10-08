import { ColumnDef } from "@tanstack/react-table";
import { EditCell } from "./EditCell";
import { EditableTableCell } from "./EditableTableCell";

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
    meta: {
      type: "number",
      required: true,
      validationMessage: "Total is required",
    },
  },
  //   columnHelper.accessor("major", {
  //     header: "Major",
  //     cell: TableCell,
  //     meta: {
  //       type: "select",
  //       options: [
  //         { value: "", label: "Select" },
  //         { value: "Computer Science", label: "Computer Science" },
  //         { value: "Communications", label: "Communications" },
  //         { value: "Business", label: "Business" },
  //         { value: "Psychology", label: "Psychology" },
  //       ],
  //       required: true,
  //     },
  //   }),
  {
    header: "Edit",
    cell: EditCell,
  },
];
