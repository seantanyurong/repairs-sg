'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from '@/components/ui/select';
import { updateCustomer } from '@/lib/actions/customers';
import { toast } from 'sonner';

const customerSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  status: z.enum(['whitelisted', 'blacklisted']),
});

export default function EditCustomerClient({
  customer,
}: {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    status: string;
  };
}) {
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      status: customer.status as 'whitelisted' | 'blacklisted',
    },
  });

  const onSubmit = async () => {
    setMessage('');
    setErrors({});
    console.log(form.getValues());
    const result = await updateCustomer(form.getValues());
    if (result?.errors) {
      setMessage(result.message);
      setErrors(result.errors);
      return;
    } else {
      setMessage(result.message);
      form.reset(form.getValues());
      toast('Customer updated successfully');
      router.push('/staff/customer-management');
      router.refresh();
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
        <FormField
          control={form.control}
          name='id'
          render={({ field }) => {
            return (
              <FormItem hidden>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input placeholder='ID' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name='firstName'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder={customer.firstName} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder={customer.lastName} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name='status'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select defaultValue={customer.status} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a customer status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='whitelisted'>Whitelisted</SelectItem>
                      <SelectItem value='blacklisted'>Blacklisted</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type='submit' className='w-full'>
          Update Customer
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
