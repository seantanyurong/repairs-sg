/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  quotationExpiry: z.date().optional(),
  notes: z.string().optional(),
});

const QuoteDetailsClient = ({
  quotation,
  customer,
  updateQuotationAction,
}: {
  quotation: any;
  customer: { name: string; email: string; phone: string };
  updateQuotationAction: any;
}) => {
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const quotationForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quotationExpiry: quotation.quotationExpiry,
      notes: quotation.notes,
    },
  });

  const onSubmit = async () => {
    setErrors({});

    const result = await updateQuotationAction(
      JSON.stringify(quotationForm.getValues())
    );
    if (result?.errors) {
      setErrors(result.errors);
      return;
    } else {
      router.refresh();
      quotationForm.reset(quotationForm.getValues());
      toast.success(result.message);
    }
    return result.id;
  };

  return (
    <div className="flex flex-col gap-2 lg:w-1/2 w-full">
      <Form {...quotationForm}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            quotationForm.handleSubmit(onSubmit)();
          }}
          className="w-auto flex flex-col gap-4"
        >
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Quotation Information
          </h4>
          <fieldset
            disabled={
              quotation.status === "Declined" || quotation.status === "Accepted"
            }
          >
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
          </fieldset>
          <div className="flex flex-row gap-2 justify-end">
            <Button
              disabled={
                quotation.status === "Declined" ||
                quotation.status === "Accepted"
              }
              type="submit"
              className="w-auto"
            >
              Update Quotation
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
      {quotation.status === "Declined" && (
        <div className="flex flex-col gap-2">
          <p>Quote Decline Reason: {quotation.declineReason}</p>
          <p>Quote Decline Details: {quotation.declineDetails}</p>
        </div>
      )}
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Customer Information
      </h4>
      <p>Name: {customer.name}</p>
      <p>Email: {customer.email}</p>
      <p>Phone: {customer.phone}</p>
    </div>
  );
};

export default QuoteDetailsClient;
