import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LineItem, LineItemColumns } from "./LineItemColumns";
import { FooterCell } from "./FooterCell";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const defaultData: LineItem[] = [
  {
    description: "Item 1",
    quantity: 1,
    total: 1,
  },
  {
    description: "Item 2",
    quantity: 2,
    total: 2,
  },
  {
    description: "Item 3",
    quantity: 3,
    total: 3,
  },
];

export const EditableTable = () => {
  const [data, setData] = useState(() => [...defaultData]);
  const [originalData, setOriginalData] = useState(() => [...defaultData]);
  const [editedRows, setEditedRows] = useState({});
  const [validRows, setValidRows] = useState<{
    [key: number]: { [key: string]: boolean };
  }>({});

  const table = useReactTable({
    data,
    columns: LineItemColumns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      editedRows,
      setEditedRows,
      validRows,
      setValidRows,
      revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setData((old) =>
            old.map((row, index) =>
              index === rowIndex ? originalData[rowIndex] : row
            )
          );
        } else {
          setOriginalData((old) =>
            old.map((row, index) => (index === rowIndex ? data[rowIndex] : row))
          );
        }
      },
      updateData: (
        rowIndex: number,
        columnId: string,
        value: string,
        isValid: boolean
      ) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
        setValidRows((old) => ({
          ...old,
          [rowIndex]: { ...old[rowIndex], [columnId]: isValid },
        }));
      },
      addRow: () => {
        const newRow: LineItem = {
          description: "Transport Fee",
          quantity: 1,
          total: 1,
        };
        const setFunc = (old: LineItem[]) => [...old, newRow];
        setData(setFunc);
        setOriginalData(setFunc);
      },
      removeRow: (rowIndex: number) => {
        const setFilterFunc = (old: LineItem[]) =>
          old.filter((_row: LineItem, index: number) => index !== rowIndex);
        setData(setFilterFunc);
        setOriginalData(setFilterFunc);
      },
      removeSelectedRows: (selectedRows: number[]) => {
        const setFilterFunc = (old: LineItem[]) =>
          old.filter((_row, index) => !selectedRows.includes(index));
        setData(setFilterFunc);
        setOriginalData(setFilterFunc);
      },
    },
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableHead
            colSpan={table.getCenterLeafColumns().length}
            align="right"
          >
            <FooterCell table={table} />
          </TableHead>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
