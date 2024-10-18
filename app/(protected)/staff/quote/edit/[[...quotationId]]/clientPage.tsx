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
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema } from "@pdfme/common";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { QuoteTemplateType } from "../../templates/_components/QuoteTemplateColumns";
import { LineItem } from "./_components/LineItemColumns";
import { QuoteTemplateForm } from "./_components/TemplateForm";

const formSchema = z.object({
  quotationDate: z.date(),
  quotationExpiry: z
    .date()
    .min(new Date(), { message: "Expiry date must be after today" }),
  customerEmail: z.string().email(),
  quoteTemplate: z.string().min(1, { message: "Select a quote template" }),
  notes: z.string().optional(),
  customer: z.string().optional(),
});

export interface LineItemTotals {
  subtotal: string;
  taxAmt: string;
  total: number;
}

const defaultTotals = {
  subtotal: "",
  taxAmt: "",
  total: 0,
};

interface EditQuoteClientProps {
  templates: QuoteTemplateType[];
  getCustomerAction: (email: string) => Promise<string>;
  quotationFormValues: { [x: string]: unknown };
  templateFormValues: { [x: string]: unknown };
  lineItemValues: LineItem[];
  submitQuotationAction: (
    quote: string,
    templateInputs: string
  ) => Promise<string>;
}

const EditQuoteClient = ({
  templates,
  getCustomerAction,
  quotationFormValues,
  templateFormValues,
  lineItemValues,
  submitQuotationAction,
}: EditQuoteClientProps) => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [lineItemTotal, setTotals] = useState<LineItemTotals>(defaultTotals);
  const { user } = useUser();
  const router = useRouter();

  const quotationForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: quotationFormValues,
  });

  const selectedTemplate = useWatch({
    control: quotationForm.control,
    name: "quoteTemplate",
  });

  const templateForm = useForm({ defaultValues: templateFormValues });

  const getCustomerByEmail = async () => {
    quotationForm.clearErrors("customerEmail");
    const fieldState = quotationForm.getFieldState("customerEmail");
    if (fieldState.invalid) {
      quotationForm.setError("customerEmail", {
        type: "pattern",
        message: "Enter a valid email address",
      });
      return;
    }
    setIsLoading(true);

    try {
      templateForm.setValue(
        "sales_email",
        user?.primaryEmailAddress?.emailAddress
      );

      templateForm.setValue("sales_mobile", user?.unsafeMetadata.phone);

      const result: User = JSON.parse(
        await getCustomerAction(quotationForm.getValues("customerEmail"))
      );

      quotationForm.setValue("customer", result.id);
      toast.success("Customer found!");
      templateForm.setValue(
        "customer_name",
        result.fullName ?? `${result.firstName} ${result.lastName}`
      );
    } catch (err) {
      quotationForm.setValue("customer", undefined);
      templateForm.setValue("customer_name", "");
      console.error(err);
      toast.error(
        (err as Error).message ?? "An error has ocurred, please try again!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    setErrors({});

    const transformedItems = lineItems.map((item) => [
      item.description,
      item.quantity.toString(),
      item.total.toString(),
    ]);
    templateForm.setValue("line_items", transformedItems);
    templateForm.setValue("subtotal", lineItemTotal.subtotal);
    templateForm.setValue("taxes", lineItemTotal.taxAmt);
    templateForm.setValue(
      "total_amount",
      lineItemTotal.total.toLocaleString("en-SG", {
        style: "currency",
        currency: "SGD",
      })
    );

    const response = await submitQuotationAction(
      JSON.stringify({
        ...quotationForm.getValues(),
        totalAmount: lineItemTotal.total,
        // html input turns number into string, so need to convert back
        lineItems: lineItems.map((item) => ({
          description: item.description,
          quantity: parseInt(item.quantity.toString()),
          total: parseInt(item.total.toString()),
        })),
      }),
      JSON.stringify(templateForm.getValues())
    );

    const result: {
      message: string;
      id?: string;
      errors?: string | Record<string, unknown>;
    } = JSON.parse(response);

    if (result?.errors) {
      setErrors(result.errors);
      return;
    } else {
      router.refresh();
      quotationForm.reset(quotationForm.getValues());
      toast.success(result.message);
      return result.id;
    }
  };

  const handleContinue = async () => {
    quotationForm.trigger();
    if (!quotationForm.formState.isValid) return;
    const quotationId = await onSubmit();
    if (quotationId) router.push(`/staff/quote/view/${quotationId}`);
  };

  return (
    <>
      <Form {...quotationForm}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            quotationForm.handleSubmit(onSubmit)();
          }}
          className="w-full md:w-2/3 flex flex-col gap-4"
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
            name="quotationExpiry"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Quotation Expiry Date</FormLabel>
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
                        disabled={{ before: new Date() }}
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
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
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
          {selectedTemplate &&
            templates
              .filter(
                (t) => t._id === quotationForm.getValues("quoteTemplate")
              )[0]
              .pdfTemplate.schemas[0].filter((t: Schema) => !t.readOnly)
              .map((t: Schema) => {
                return (
                  <QuoteTemplateForm
                    key={t.name}
                    schema={t}
                    form={templateForm}
                    setLineItems={setLineItems}
                    setTotals={setTotals}
                    initialData={lineItemValues}
                  />
                );
              })}

          <div className="flex flex-row gap-4">
            <Button
              variant="outline"
              type="submit"
              className="w-auto"
            >
              Save Quotation
            </Button>
            <Button
              type="button"
              onClick={() => handleContinue()}
              className="w-auto"
            >
              Continue
            </Button>
          </div>

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

export default EditQuoteClient;
