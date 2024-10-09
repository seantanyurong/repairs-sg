import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { SetStateAction } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { EditableTable } from "./EditableTable/EditableTable";
import { LineItem, lineItemColumns } from "./LineItemColumns";
import { Schema } from "@pdfme/common";
import { Input } from "@/components/ui/input";

const defaultData: LineItem[] = [
  {
    description: "Transport Fee",
    quantity: 1,
    total: 40,
  },
];

interface TemplateFormProps {
  schema: Schema;
  form: UseFormReturn<FieldValues>;
  setLineItems: {
    (value: SetStateAction<LineItem[]>): void;
    (arg0: LineItem[]): void;
  };
}

export function QuoteTemplateForm({
  schema,
  form,
  setLineItems,
}: TemplateFormProps) {
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
            initialData={defaultData}
            columns={lineItemColumns}
            onStateChange={(data) => setLineItems(data)}
          />
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
