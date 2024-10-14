// table-core.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RowData } from "@tanstack/react-table";

declare module "@tanstack/table-core" {
  interface TableMeta {
    editedRows: { [key: string]: boolean };
    validRows: { [key: string]: { [key: string]: boolean } };
    setEditedRows: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >;
    setValidRows: React.Dispatch<
      React.SetStateAction<{ [key: string]: { [key: string]: boolean } }>
    >;
    revertData: (rowIndex: number, revert: boolean) => void;
    removeRow: (rowIndex: number) => void;
    updateData: (
      rowIndex: number,
      columnId: string,
      value: string,
      isValid: boolean
    ) => void;
    addRow: () => void;
    removeSelectedRows: (selectedRows: number[]) => void;
  }

  interface ColumnMeta {
    validate?: (value: string) => boolean;
    validationMessage: string;
    type: "text" | "select" | "number";
    required: boolean;
    pattern?: string;
    options?: {
      label: string;
      value: string;
    }[];
  }
}
