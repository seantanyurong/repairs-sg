'use client';

import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

// import { getInvoiceTemplate } from "@/lib/actions/invoiceTemplate";
// import { createClerkClient } from "@clerk/nextjs/server";
// import CreateInvoiceClient from "./clientPage";

// const CreateInvoice = async () => {
//   const invoiceTemplate = await getInvoiceTemplate();

//   const getCustomerAction = async (email: string) => {
//     "use server";
//     // Fetch Customers
//     const custClerk = createClerkClient({ secretKey: process.env.CUSTOMER_CLERK_SECRET_KEY });
//     const customer = await custClerk.users.getUserList({ emailAddress: [email] });

//     return customer.totalCount === 0 ? "No Customer Found" : customer.data[0].fullName ?? "";
//   };

//   return (
//     <CreateInvoiceClient
//       template={JSON.parse(invoiceTemplate)}
//       getCustomerAction={getCustomerAction}
//     />
//   );
// };

// export default CreateInvoice;

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
});

export default function CreateInvoice() {
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();

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

