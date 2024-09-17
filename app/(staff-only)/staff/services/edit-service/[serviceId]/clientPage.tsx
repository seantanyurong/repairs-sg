'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateService } from '@/lib/actions/services';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from '@/components/ui/select';

const formSchema = z.object({
  _id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(['Draft', 'Active', 'Disabled']),
});

export default function EditServiceClient({
  service,
}: {
  service: { _id: string; name: string; description: string; status: 'Draft' | 'Active' | 'Disabled' | undefined };
}) {
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();

  console.log(service);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: service._id,
      name: service.name,
      description: service.description,
      status: service.status,
    },
  });

  const onSubmit = async () => {
    setMessage('');
    setErrors({});
    const result = await updateService(form.getValues());
    if (result?.errors) {
      setMessage(result.message);
      setErrors(result.errors);
      return;
    } else {
      setMessage(result.message);
      router.refresh();
      form.reset(form.getValues());
      router.push('/staff/services');
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
          name='_id'
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
          name='name'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder='Description' {...field} />
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
                <FormLabel>Service Status</FormLabel>
                <Select defaultValue={service.status} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a service status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Draft'>Draft</SelectItem>
                    <SelectItem value='Active'>Active</SelectItem>
                    <SelectItem value='Disabled'>Disabled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type='submit' className='w-full'>
          Update Service
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
