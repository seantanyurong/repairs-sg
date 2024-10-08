import { createColumnHelper } from "@tanstack/react-table";
import { EditCell } from "./EditCell";
import { EditableTableCell } from "./EditableTableCell";

export interface LineItem {
  description: string;
  quantity: number;
  total: number;
}

const columnHelper = createColumnHelper<LineItem>();

export const LineItemColumns = [
  columnHelper.accessor("description", {
    header: "Description",
    cell: EditableTableCell,
    meta: {
      type: "text",
      required: true,
    },
  }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
    cell: EditableTableCell,
    meta: {
      type: "number",
      required: true,
    },
  }),
  columnHelper.accessor("total", {
    header: "Total",
    cell: EditableTableCell,
    meta: {
      type: "number",
      required: true,
    },
  }),
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
  columnHelper.display({
    id: "edit",
    cell: EditCell,
  }),
];
