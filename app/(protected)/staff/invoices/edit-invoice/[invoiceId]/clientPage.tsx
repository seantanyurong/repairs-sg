"use client";

import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CalendarIcon, InfoIcon, Loader2 } from "lucide-react";
import { updateInvoice } from "@/lib/actions/invoices";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formSchema = z
  .object({
    _id: z.string().min(1),
    lineItems: z.array(
      z.object({
        description: z.string().min(1, "Description Is Required"),
        quantity: z.number().min(1, "Quantity Must Be Greater Than 0"),
        amount: z.number().min(0, "Line Item Amount Must Be 0 or Greater"),
      }),
    ),
    dateIssued: z.date(),
    dateDue: z.date(),
    totalAmount: z.number().min(0, "Total Amount Must Be 0 or Greater"),
    remainingDue: z
      .number()
      .min(0, "Remaining Due Amount Must Be 0 or Greater"),
    // invoiceTemplate: z.string().min(1),
    paymentStatus: z.enum(["Unpaid"]),
    validityStatus: z.enum(["draft", "active"]),
    publicNote: z.string().max(500),
    customer: z.string(),
    lastUpdatedBy: z.string(),
  })
  .refine((data) => data.remainingDue <= data.totalAmount, {
    path: ["remainingDue"],
    message: "Remaining Due Cannot Be More Than Total Amount",
  });

export default function EditInvoiceClient({
  invoice,
  getCustomerAction,
  getStaffAction,
  getCustomerEmail,
  getStaffEmail,
  currCustEmail,
  currStaffEmail,
}: {
  invoice: {
    _id: string;
    lineItems: {
      description: string;
      quantity: number;
      amount: number;
    }[];
    dateIssued: Date;
    dateDue: Date;
    totalAmount: number;
    remainingDue: number;
    paymentStatus: "Unpaid";
    validityStatus: "draft" | "active";
    publicNote: string;
    customer: string;
    lastUpdatedBy: string;
  };
  getCustomerAction: (email: string) => Promise<string>;
  getStaffAction: (email: string) => Promise<string>;
  getCustomerEmail: (customer: string) => Promise<string>;
  getStaffEmail: (staff: string) => Promise<string>;
  currCustEmail: string;
  currStaffEmail: string;
}) {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isCustLoading, setIsCustLoading] = useState(false);
  const [isStaffLoading, setIsStaffLoading] = useState(false);
  const [currentCustEmail, setCurrentCustEmail] = useState(currCustEmail);
  const [currentStaffEmail, setCurrentStaffEmail] = useState(currStaffEmail);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: invoice._id,
      lineItems: invoice.lineItems.map((lineItem) => ({
        description: lineItem.description,
        quantity: lineItem.quantity,
        amount: lineItem.amount,
      })),
      dateIssued: invoice.dateIssued,
      dateDue: invoice.dateDue,
      totalAmount: invoice.totalAmount,
      remainingDue: invoice.remainingDue,
      paymentStatus: invoice.paymentStatus,
      validityStatus: invoice.validityStatus,
      publicNote: invoice.publicNote,
      customer: invoice.customer,
      lastUpdatedBy: invoice.lastUpdatedBy,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const getCustomerByEmail = async () => {
    const fieldState = form.getFieldState("customer");
    if (!fieldState.isTouched || fieldState.invalid) {
      form.setError(
        "customer",
        { type: "pattern", message: "Enter A Valid Email!" },
        { shouldFocus: true },
      );
      return;
    }
    setIsCustLoading(true);
    try {
      const result = await getCustomerAction(form.getValues("customer"));
      if (result === "No Customer Found") {
        toast.error(result);
        return;
      } else {
        toast.success("Customer Found!");
        form.setValue("customer", result);
        setCurrentCustEmail(await getCustomerEmail(result));
      }

      // templateForm.setValue("customer_name", result);
      // templateForm.setValue(
      //   "sales_email",
      //   user?.primaryEmailAddress?.emailAddress
      // );
      // templateForm.setValue("sales_mobile", user?.primaryPhoneNumber);
    } catch (err) {
      console.error(err);
      toast.error("An Error Has Ocurred, Please Try Again!");
    } finally {
      setIsCustLoading(false);
    }
  };

  const getStaffByEmail = async () => {
    const fieldState = form.getFieldState("lastUpdatedBy");
    if (!fieldState.isTouched || fieldState.invalid) {
      form.setError(
        "lastUpdatedBy",
        { type: "pattern", message: "Enter A Valid Email!" },
        { shouldFocus: true },
      );
      return;
    }
    setIsStaffLoading(true);
    try {
      const result = await getStaffAction(form.getValues("lastUpdatedBy"));
      if (result === "No Staff Found") {
        toast.error(result);
        return;
      } else {
        toast.success("Staff Found!");
        form.setValue("lastUpdatedBy", result);
        setCurrentStaffEmail(await getStaffEmail(result));
      }
      // templateForm.setValue("customer_name", result);
      // templateForm.setValue(
      //   "sales_email",
      //   user?.primaryEmailAddress?.emailAddress
      // );
      // templateForm.setValue("sales_mobile", user?.primaryPhoneNumber);
    } catch (err) {
      console.error(err);
      toast.error("An Error Has Ocurred, Please Try Again!");
    } finally {
      setIsStaffLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    const total = form.getValues("lineItems").reduce((sum, item) => {
      return sum + (item.amount || 0) * (item.quantity || 0);
    }, 0);
    const currentTotalAmount = form.getValues("totalAmount");
    const margin = total - currentTotalAmount;

    form.setValue("totalAmount", total);
    form.setValue("remainingDue", form.getValues("remainingDue") + margin);
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [form.watch("lineItems")]);

  const onSubmit = async () => {
    setMessage("");
    setErrors({});

    // Format Line Items
    const formatLineItems = form
      .getValues()
      .lineItems.map(
        (item) =>
          `Description: ${item.description} Quantity: ${item.quantity} Amount: ${item.amount}`,
      );

    const formData = {
      ...form.getValues(),
      lineItems: formatLineItems,
    };
    console.log(formData);
    const result = await updateInvoice(formData);
    if (result?.errors) {
      setMessage(result.message);
      setErrors(result.errors);
      return;
    } else {
      setMessage(result.message);
      router.refresh();
      form.reset(form.getValues());
      router.push("/staff/invoices");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }}
        className="max-w-2xl w-full flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="_id"
          render={({ field }) => {
            return (
              <FormItem hidden>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input placeholder="ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="mb-4">
          <FormLabel>Line Items (Description | Quantity | Amount)</FormLabel>
          {fields.map((item, index) => (
            <div key={item.id} className="flex gap-2 mb-2">
              {/* Line Item Description */}
              <FormField
                control={form.control}
                name={`lineItems.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Description"
                        {...field}
                        className="w-72"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Line Item Quantity */}
              <FormField
                control={form.control}
                name={`lineItems.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Quantity"
                        {...field}
                        onChange={(event) => {
                          field.onChange(+event.target.value);
                          calculateTotalAmount();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Line Item Amount */}
              <FormField
                control={form.control}
                name={`lineItems.${index}.amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Amount"
                        {...field}
                        onChange={(event) => {
                          field.onChange(+event.target.value);
                          calculateTotalAmount();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                className="bg-red-500 text-white"
                onClick={() => {
                  remove(index);
                  calculateTotalAmount();
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            className="mt-2 bg-primary text-white"
            onClick={() => append({ description: "", quantity: 1, amount: 0 })}
          >
            + Add Line Item
          </Button>
        </div>
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Total Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Total Amount"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="remainingDue"
          render={({ field }) => {
            const totalAmount = form.watch("totalAmount");
            return (
              <FormItem>
                <FormLabel>Remaining Due</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Remaining Due"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="dateIssued"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Date Issued</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"}>
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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
          control={form.control}
          name="dateDue"
          render={({ field }) => {
            const dateIssued = form.watch("dateIssued");
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Date Due</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"}>
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) =>
                        dateIssued ? date < dateIssued : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="paymentStatus"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={true}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Payment Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="validityStatus"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Validity Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Validity Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="publicNote"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Public Note</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter Notes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="customer"
          render={({ field }) => {
            return (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Customer Email</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-2 h-4 w-4 text-gray-500 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>
                        Current Customer Email:{" "}
                        {currentCustEmail || "No email selected"}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <FormControl>
                  <Input placeholder="Customer Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button
          className="self-center ml-auto"
          disabled={isCustLoading}
          type="button"
          onClick={() => getCustomerByEmail()}
        >
          {isCustLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait...
            </>
          ) : (
            <>Find Customer</>
          )}
        </Button>
        <FormField
          control={form.control}
          name="lastUpdatedBy"
          render={({ field }) => {
            return (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Staff Email</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-2 h-4 w-4 text-gray-500 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>
                        Current Staff Email:{" "}
                        {currentStaffEmail || "No email selected"}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input placeholder="Staff Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button
          className="self-center ml-auto"
          disabled={isStaffLoading}
          type="button"
          onClick={() => getStaffByEmail()}
        >
          {isStaffLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait...
            </>
          ) : (
            <>Find Staff</>
          )}
        </Button>
        <Button type="submit" className="w-full">
          Edit Invoice
        </Button>
        {message ? <h2>{message}</h2> : null}
        {errors ? (
          <div className="mb-10 text-red-500">
            {Object.keys(errors).map((key) => (
              <p key={key}>{`${key}: ${errors[key as keyof typeof errors]}`}</p>
            ))}
          </div>
        ) : null}
      </form>
    </Form>
  );
}
