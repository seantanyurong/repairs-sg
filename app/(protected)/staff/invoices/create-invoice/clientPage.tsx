'use client';

import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { Loader2 } from "lucide-react";
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addInvoice } from '@/lib/actions/invoices';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  SelectValue, 
  SelectTrigger, 
  SelectContent, 
  SelectItem, 
  Select 
} from '@/components/ui/select';
import { toast } from "sonner";

const formSchema = z.object({
  lineItems: z.array(z.object({
    description: z.string().min(1, "Description Is Required"),
    quantity: z.number().min(1, "Quantity Must Be Greater Than 0")
  })),
  totalAmount: z.number().min(0.01),
  // invoiceTemplate: z.string().min(1),
  paymentStatus: z.enum(['Unpaid']),
  validityStatus: z.enum(['draft', 'active']),
  publicNote: z.string().max(500),
  customer: z.string(),
  staff: z.string(),
});

export default function CreateInvoiceClient({
  // template,
  getCustomerAction,
  getStaffAction,
}: {
  // template: string,
  getCustomerAction: (email: string) => Promise<string>,
  getStaffAction: (email: string) => Promise<string>,
}) {
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isCustLoading, setIsCustLoading] = useState(false);
  const [isStaffLoading, setIsStaffLoading] = useState(false);
  const router = useRouter();

  const getCustomerByEmail = async () => {
    const fieldState = form.getFieldState("customer");
    if (!fieldState.isTouched || fieldState.invalid) {
      form.setError(
        "customer",
        { type: "pattern", message: "Enter A Valid Email!" },
        { shouldFocus: true }
      );
      return;
    }
    setIsCustLoading(true);
    try {
      const result = await getCustomerAction(
        form.getValues("customer")
      );
      if (result === "No Customer Found!") {
        toast.error(result);
        return;
      } else {
        toast.success("Customer Found!");
        form.setValue("customer", result);
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
    const fieldState = form.getFieldState("staff");
    if (!fieldState.isTouched || fieldState.invalid) {
      form.setError(
        "staff",
        { type: "pattern", message: "Enter A Valid Email!" },
        { shouldFocus: true }
      );
      return;
    }
    setIsStaffLoading(true);
    try {
      const result = await getStaffAction(
        form.getValues("staff")
      );
      if (result === "No Staff Found!") {
        toast.error(result);
        return;
      } else {
        toast.success("Staff Found!");
        form.setValue("staff", result);
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lineItems: [{ description: '', quantity: 1 }],
      totalAmount: 0,
      publicNote: '',
      // invoiceTemplate: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const onSubmit = async () => {
    setMessage('');
    setErrors({});

    // Format Line Items
    const formatLineItems = form.getValues().lineItems.map(
      (item) => `${item.quantity}x ${item.description}`
    );

    const formData = {
      ...form.getValues(),
      lineItems: formatLineItems,
    };
    const result = await addInvoice(formData);
    if (result?.errors) {
      setMessage(result.message);
      setErrors(result.errors);
      return;
    } else {
      setMessage(result.message);
      router.refresh();
      form.reset(form.getValues());
      router.push('/staff/invoices');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }}
        className='max-w-md w-full flex flex-col gap-4'>
        <div className='mb-4'>
          <FormLabel>Line Items</FormLabel>
          {fields.map((item, index) => (
            <div key={item.id} className='flex gap-2 mb-2'>
              {/* Line Item Description */}
              <FormField
                control={form.control}
                name={`lineItems.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder='Description' {...field}  className='w-72' />
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
                        type='number'
                        placeholder='Quantity'
                        {...field}
                        onChange={(event) => field.onChange(+event.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='button'
                className='bg-red-500 text-white'
                onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button
            type='button'
            className='mt-2 bg-primary text-white'
            onClick={() => append({ description: '', quantity: 1 })}>
            + Add Line Item
          </Button>
        </div>
        <FormField
          control={form.control}
          name='totalAmount'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Total Amount</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='totalAmount'
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
          name='paymentStatus'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select Payment Status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Unpaid'>Unpaid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name='validityStatus'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Validity Status</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select Validity Status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='draft'>Draft</SelectItem>
                    <SelectItem value='active'>Active</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name='publicNote'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Public Note</FormLabel>
                <FormControl>
                  <Textarea placeholder='Enter Notes' {...field} />
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
          name="staff"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Staff Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Staff Email"
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
        <Button type='submit' className='w-full'>
          Create Invoice
        </Button>
        {message ? <h2>{message}</h2> : null}
        {errors ? (
          <div className='mb-10 text-red-500'>
            {Object.keys(errors).map((key) => (
              <p key={key}>{`${key}: ${errors[key as keyof typeof errors]}`}</p>
            ))}
          </div>
        ) : null}
      </form>
    </Form>
  );
}

