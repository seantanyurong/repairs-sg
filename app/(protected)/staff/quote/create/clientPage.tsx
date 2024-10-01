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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema } from "@pdfme/common";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { FieldValues, useForm, UseFormReturn, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { QuoteTemplateType } from "../templates/_components/QuoteTemplateColumns";

const formSchema = z.object({
  quotationDate: z.date(),
  customerEmail: z.string().email(),
  quoteTemplate: z.string().min(1),
  notes: z.string().min(1),
});

function renderTemplateFields(
  schema: Schema,
  form: UseFormReturn<FieldValues>
) {
  switch (schema.type) {
    case "multiVariableText":
      if (schema.variables) {
        return (
          <>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              {schema.name}
            </h4>
            {(schema.variables as string[]).map((variable: string) => {
              return (
                <FormField
                  key={`${schema.name}-${variable}`}
                  control={form.control}
                  name={variable}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{variable}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
          <p>{schema.type}</p>
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
              <FormItem>
                <FormLabel>{schema.name}</FormLabel>
                <FormControl>
                  <Input
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
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
      quotationForm.setError(
        "customerEmail",
        { type: "pattern", message: "Enter a valid email address" },
        { shouldFocus: true }
      );
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
    } catch (err) {
      console.error(err);
      toast.error("An error has ocurred, please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    setMessage("");
    setErrors({});
    // const result = await addService(form.getValues());
    // if (result?.errors) {
    //   setMessage(result.message);
    //   setErrors(result.errors);
    //   return;
    // } else {
    //   setMessage(result.message);
    //   router.refresh();
    //   form.reset(form.getValues());
    //   router.push("/staff/services");
    // }
  };

  return (
    <>
      <Button onClick={() => console.log(templateWatch)}></Button>
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
                          templates.map(
                            (template: QuoteTemplateType, index: number) => (
                              <SelectItem
                                key={template._id}
                                value={index.toString()}
                              >
                                {template.name}
                              </SelectItem>
                            )
                          )}
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
            templates[parseInt(selectedTemplate)].pdfTemplate.schemas[0]
              .filter((t: Schema) => !t.readOnly)
              .map((t: Schema) => renderTemplateFields(t, templateForm))}

          <Button
            type="submit"
            className="w-full"
            disabled
          >
            Preview Quotation
          </Button>
          {message ? <h2>{message}</h2> : null}
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
