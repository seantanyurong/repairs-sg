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
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { LineItem } from "../../_components/LineItemColumns";
import { QuoteTemplateType } from "../../templates/_components/QuoteTemplateColumns";
import { TemplateForm } from "../../_components/TemplateForm";

const formSchema = z.object({
  quotationDate: z.date(),
  quotationExpiry: z.date().optional(),
  customerEmail: z.string().email(),
  quoteTemplate: z.string().min(1, { message: "Select a quote template" }),
  notes: z.string().optional(),
});

const CreateQuoteClient = ({
  templates,
  getCustomerAction,
}: {
  templates: QuoteTemplateType[];
  getCustomerAction: (email: string) => Promise<string>;
}) => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
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

  const calculateTotals = (lineItems: LineItem[]) => {
    const total = lineItems.reduce((acc, item) => acc + item.total, 0);
    const taxAmt = total * 0.09;
    const currencyFormat = new Intl.NumberFormat("en-SG", {
      style: "currency",
      currency: "SGD",
    });
    templateForm.setValue("subtotal", currencyFormat.format(total));
    templateForm.setValue("taxes", currencyFormat.format(taxAmt));
    templateForm.setValue(
      "total_amount",
      currencyFormat.format(total + taxAmt)
    );
    return total + taxAmt;
  };

  const onSubmit = async () => {
    setErrors({});
    const totalAmount = calculateTotals(lineItems);
    const transformedItems = lineItems.map((item) => [
      item.description,
      item.quantity.toString(),
      item.total.toString(),
    ]);
    templateForm.setValue("line_items", transformedItems);

    const result = await addQuotation(
      JSON.stringify({ ...quotationForm.getValues(), totalAmount }),
      JSON.stringify(templateForm.getValues())
    );
    if (result?.errors) {
      setErrors(result.errors);
      return;
    } else {
      router.refresh();
      quotationForm.reset(quotationForm.getValues());
      router.push(`/staff/quote/view/${result.id}`);
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
          {selectedTemplate &&
            templates
              .filter(
                (t) => t._id === quotationForm.getValues("quoteTemplate")
              )[0]
              .pdfTemplate.schemas[0].filter((t: Schema) => !t.readOnly)
              .map((t: Schema) => {
                return (
                  <TemplateForm
                    key={t.name}
                    schema={t}
                    form={templateForm}
                    setLineItems={setLineItems}
                  />
                );
              })}

          <div className="flex flex-row gap-4">
            <Button
              type="submit"
              variant="outline"
              className="w-auto"
            >
              Preview Quotation
            </Button>
            <Button
              type="submit"
              className="w-auto"
            >
              Save Quotation
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

export default CreateQuoteClient;
