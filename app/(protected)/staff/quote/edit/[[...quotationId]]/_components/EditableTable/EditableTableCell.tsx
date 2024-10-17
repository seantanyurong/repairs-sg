import { Input } from "@/components/ui/input";
import { Column, Row, Table } from "@tanstack/react-table";
import { ChangeEvent, useEffect, useState } from "react";

type Option = {
  label: string;
  value: string;
};

type EditableTableCellProps<TData, TValue> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValue: () => any;
  row: Row<TData>;
  column: Column<TData, TValue>;
  table: Table<TData>;
};

export const EditableTableCell = <TData, TValue>({
  getValue,
  row,
  column,
  table,
}: EditableTableCellProps<TData, TValue>) => {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = (e: ChangeEvent<HTMLInputElement>) => {
    displayValidationMessage(e);
    tableMeta?.updateData(
      row.index,
      column.id,
      String(value),
      e.target.validity.valid
    );
  };
  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    displayValidationMessage(e);
    setValue(e.target.value);
    tableMeta?.updateData(
      row.index,
      column.id,
      e.target.value,
      e.target.validity.valid
    );
  };

  const displayValidationMessage = <
    T extends HTMLInputElement | HTMLSelectElement,
  >(
    e: ChangeEvent<T>
  ) => {
    if (columnMeta?.validate) {
      const isValid = columnMeta.validate(e.target.value);
      if (isValid) {
        e.target.setCustomValidity("");
        setValidationMessage("");
      } else {
        e.target.setCustomValidity(columnMeta.validationMessage);
        setValidationMessage(columnMeta.validationMessage);
      }
    } else if (e.target.validity.valid) {
      setValidationMessage("");
    } else {
      setValidationMessage(e.target.validationMessage);
    }
  };

  if (tableMeta?.editedRows[row.id]) {
    return columnMeta?.type === "select" ? (
      <select
        onChange={onSelectChange}
        value={initialValue}
        required={columnMeta?.required}
        title={validationMessage}
      >
        {columnMeta?.options?.map((option: Option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        type={columnMeta?.type || "text"}
        required={columnMeta?.required}
        title={validationMessage}
        pattern={columnMeta?.pattern}
      />
    );
  }
  return <span>{value}</span>;
};
