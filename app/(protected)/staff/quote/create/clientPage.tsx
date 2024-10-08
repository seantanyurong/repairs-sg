"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addQuotation } from "@/lib/actions/quotations";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema } from "@pdfme/common";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm, UseFormReturn, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { EditableTable } from "../_components/EditableTable";
import { QuoteTemplateType } from "../templates/_components/QuoteTemplateColumns";
import { LineItem, lineItemColumns } from "../_components/LineItemColumns";

const formSchema = z.object({
  quotationDate: z.date(),
  customerEmail: z.string().email(),
  quoteTemplate: z.string().min(1),
  notes: z.string().optional(),
});

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

function renderTemplateFields(
  schema: Schema,
  form: UseFormReturn<FieldValues>
) {
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
            onStateChange={(data) => console.log(data)}
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

const CreateQuoteClient = ({
  templates,
  getCustomerAction,
}: {
  templates: QuoteTemplateType[];
  getCustomerAction: (email: string) => Promise<string>;
}) => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const quotationForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quotationDate: new Date(),
      customerEmail: "",
      quoteTemplate: "",
    },
  });

  const selectedTemplate = useWatch({
    control: quotationForm.control,
    name: "quoteTemplate",
  });

  const templateForm = useForm();

  const templateWatch = useWatch({
    control: templateForm.control,
  });

  const getCustomerByEmail = async () => {
    const fieldState = quotationForm.getFieldState("customerEmail");
    if (!fieldState.isTouched || fieldState.invalid) {
      quotationForm.setError("customerEmail", {
        type: "pattern",
        message: "Enter a valid email address",
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await getCustomerAction(
        quotationForm.getValues("customerEmail")
      );
      if (result === "No customer found with that email address") {
        toast.error(result);
        return;
      }
      toast.success("Customer found!");
      templateForm.setValue("customer_name", result);
      templateForm.setValue(
        "sales_email",
        user?.primaryEmailAddress?.emailAddress
      );
      templateForm.setValue("sales_mobile", user?.primaryPhoneNumber);
    } catch (err) {
      console.error(err);
      toast.error("An error has ocurred, please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    setErrors({});
    const result = await addQuotation(
      JSON.stringify(quotationForm.getValues()),
      JSON.stringify(templateForm.getValues())
    );
    if (result?.errors) {
      setErrors(result.errors);
      return;
    } else {
      router.refresh();
      quotationForm.reset(quotationForm.getValues());
      router.push(`/staff/quote/edit/${result.id}`);
    }
  };

  return (
    <>
      <Form {...quotationForm}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            quotationForm.handleSubmit(onSubmit)();
          }}
          className="max-w-md w-full flex flex-col gap-4"
        >
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Quotation Information
          </h4>
          <FormField
            control={quotationForm.control}
            name="quotationDate"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Quotation Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              );
            }}
          />
          <FormField
            control={quotationForm.control}
            name="notes"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={quotationForm.control}
            name="quoteTemplate"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Quote Template</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a quote template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates &&
                          templates.map((template: QuoteTemplateType) => (
                            <SelectItem
                              key={template._id}
                              value={template._id}
                            >
                              {template.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={quotationForm.control}
            name="customerEmail"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Customer Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Customer Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button
            className="self-center ml-auto"
            disabled={isLoading}
            type="button"
            onClick={() => getCustomerByEmail()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>Find Customer</>
            )}
          </Button>
          <Button onClick={() => console.log(templateWatch)}>
            Console Log Template
          </Button>
          {selectedTemplate &&
            templates
              .filter(
                (t) => t._id === quotationForm.getValues("quoteTemplate")
              )[0]
              .pdfTemplate.schemas[0].filter((t: Schema) => !t.readOnly)
              .map((t: Schema) => renderTemplateFields(t, templateForm))}

          <Button
            type="submit"
            className="w-full"
          >
            Preview Quotation
          </Button>
          {errors ? (
            <div className="mb-10 text-red-500">
              {Object.keys(errors).map((key) => (
                <p
                  key={key}
                >{`${key}: ${errors[key as keyof typeof errors]}`}</p>
              ))}
            </div>
          ) : null}
        </form>
      </Form>
    </>
  );
};

export default CreateQuoteClient;
