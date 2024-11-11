import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { SetStateAction, useState } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { EditableTable } from "./EditableTable/EditableTable";
import { LineItem, lineItemColumns } from "./LineItemColumns";
import { Schema } from "@pdfme/common";
import { Input } from "@/components/ui/input";
import { LineItemTotals } from "../clientPage";

interface TemplateFormProps {
  schema: Schema;
  form: UseFormReturn<FieldValues>;
  initialData: LineItem[];
  setLineItems: {
    (value: SetStateAction<LineItem[]>): void;
    (arg0: LineItem[]): void;
  };
  setTotals: {
    (value: SetStateAction<LineItemTotals>): void;
    (arg0: LineItemTotals): void;
  };
}

export function QuoteTemplateForm({
  schema,
  form,
  setLineItems,
  setTotals,
  initialData,
}: TemplateFormProps) {
  const [subtotalState, setSubtotal] = useState("");
  const [taxAmtState, setTaxAmt] = useState("");
  const [totalState, setTotal] = useState("");

  const currencyFormat = new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
  });

  const calculateTotal = (lineItems: LineItem[]) => {
    const subtotal = lineItems.reduce(
      (acc, item) => acc + item.total * item.quantity,
      0
    );
    const taxAmt = subtotal * 0.09;
    const total = subtotal + taxAmt;
    setLineItems(lineItems);
    setSubtotal(currencyFormat.format(subtotal));
    setTaxAmt(currencyFormat.format(taxAmt));
    setTotal(currencyFormat.format(total));

    setTotals({
      subtotal: currencyFormat.format(subtotal),
      taxAmt: currencyFormat.format(taxAmt),
      total: total,
    });
  };

  switch (schema.type) {
    case "multiVariableText":
      if (schema.variables) {
        return (
          <>
            <h4
              key={schema.name}
              className="scroll-m-20 text-xl font-semibold tracking-tight"
            >
              {schema.name}
            </h4>
            {(schema.variables as string[]).map((variable: string) => {
              return (
                <FormField
                  key={`${schema.name}-${variable}`}
                  control={form.control}
                  name={`${schema.name}-${variable}`}
                  render={({ field }) => (
                    <FormItem key={`${schema.name}-${variable}-item`}>
                      <FormLabel key={`${schema.name}-${variable}-label`}>
                        {variable}
                      </FormLabel>
                      <FormControl key={`${schema.name}-${variable}-control`}>
                        <Input
                          key={`${schema.name}-${variable}-input`}
                          type="text"
                          required={schema.required}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage key={`${schema.name}-${variable}-message`} />
                    </FormItem>
                  )}
                />
              );
            })}
          </>
        );
      }
      break;
    case "table":
      return (
        <>
          <p key={schema.name}>{schema.name}</p>
          <EditableTable
            key={`${schema.name}-${schema.type}`}
            initialData={initialData}
            columns={lineItemColumns}
            onStateChange={(data) => calculateTotal(data)}
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-none">
              Subtotal: {subtotalState}
            </p>
            <p className="text-sm font-medium leading-none">
              Tax: {taxAmtState}
            </p>
            <p className="text-sm font-medium leading-none">
              Total: {totalState}
            </p>
          </div>
        </>
      );
    default:
      return (
        <>
          <FormField
            key={schema.name}
            control={form.control}
            name={schema.name}
            render={({ field }) => (
              <FormItem key={`${schema.name}-item`}>
                <FormLabel key={`${schema.name}-label`}>
                  {schema.name}
                </FormLabel>
                <FormControl key={`${schema.name}-control`}>
                  <Input
                    key={`${schema.name}-input`}
                    type="text"
                    required={schema.required}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      );
  }
}
