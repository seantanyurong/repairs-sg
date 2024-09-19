'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateVehicle } from '@/lib/actions/vehicles';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from '@/components/ui/select';

const formSchema = z.object({
  _id: z.string().min(1),
  licencePlate: z.string().min(1),
  gpsApi: z.string().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  status: z.enum(['Draft', 'Active', 'Disabled']),
});

export default function EditVehicleClient({
  vehicle,
}: {
  vehicle: { _id: string; licencePlate: string; gpsApi: string; make: string; model: string; status: 'Draft' | 'Active' | 'Disabled' | undefined };

}) {
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();

  console.log(vehicle);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: vehicle._id,
      licencePlate: vehicle.licencePlate,
      gpsApi: vehicle.gpsApi,
      make: vehicle.make,
      model: vehicle.model,
      status: vehicle.status,
    },
  });

  const onSubmit = async () => {
    setMessage('');
    setErrors({});
    const result = await updateVehicle(form.getValues());
    if (result?.errors) {
      setMessage(result.message);
      setErrors(result.errors);
      return;
    } else {
      setMessage(result.message);
      router.refresh();
      form.reset(form.getValues());
      router.push('/staff/vehicles');
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
          name='licencePlate'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Licence Plate</FormLabel>
                <FormControl>
                  <Input placeholder='Plate Number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name='gpsApi'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>GPS API</FormLabel>
                <FormControl>
                  <Input placeholder='GPS API' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name='make'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input placeholder='Make' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name='model'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder='Model' {...field} />
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
                <FormLabel>Vehicle Status</FormLabel>
                <Select defaultValue={vehicle.status} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a vehicle status' />
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
          Update Vehicle
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
