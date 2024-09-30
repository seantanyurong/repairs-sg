"use client";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getQuoteTemplates } from "@/lib/actions/quoteTemplates";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { QuoteTemplateType } from "../../templates/_components/QuoteTemplateColumns";

const formSchema = z.object({
  quotationDate: z.date(),
  customerEmail: z.string().email(),
  quoteTemplate: z.string().min(1),
  notes: z.string().min(1),
});

const EditQuotation = () => {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [templates, setTemplates] = useState<QuoteTemplateType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getTemplates = useCallback(async () => {
    try {
      const quoteTemplates = await getQuoteTemplates();
      setTemplates(quoteTemplates);
    } catch (e) {
      console.error(e);
      router.push("/staff/quote/");
      toast.error("Error fetching template: Please try again.");
    }
  }, []);

  useEffect(() => {
    getTemplates();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quotationDate: new Date(),
      customerEmail: "",
      quoteTemplate: "",
    },
  });

  const getCustomerByEmail = async () => {
    const fieldState = form.getFieldState("customerEmail");
    if (!fieldState.isTouched || fieldState.invalid) {
      form.setError(
        "customerEmail",
        { type: "pattern", message: "Enter a valid email address" },
        { shouldFocus: true }
      );
      return;
    }
    console.log(isLoading);
    setIsLoading(true);
    try {
      console.log(isLoading);
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Customer found!");
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("An error has ocurred, please try again!");
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
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
          }}
          className="max-w-md w-full flex flex-col gap-4"
        >
          <FormField
            control={form.control}
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
                        {templates.map((template: QuoteTemplateType) => (
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
            control={form.control}
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

          <Button
            type="submit"
            className="w-full"
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

export default EditQuotation;
