'use client';

import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
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
  invoiceTemplate: z.string().min(1),
  job: z.string(),
  lineItems: z.array(z.object({
    description: z.string().min(1, "Description Is Required"),
    quantity: z.number().min(1, "Quantity Must Be Greater Than 0"),
    amount: z.number().min(1, "Amount Must Be Greater Than 0"),
  })),
  totalAmount: z.number().min(1),
  paymentStatus: z.enum(['Unpaid']),
  validityStatus: z.enum(['draft', 'active']),
  publicNote: z.string().max(500),
  customer: z.string(),
  staff: z.string(),
});

export default function CreateInvoiceClient({
  getCustomerAction,
  getStaffAction,
  getJobsAction,
}: {
  getCustomerAction: (email: string) => Promise<string>,
  getStaffAction: (email: string) => Promise<string>,
  getJobsAction: () => Promise<{
    id: string,
    service: string,
    quantity: number,
    price: number,
    customer: string,
    staff: string,
  }[]>
}) {
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isCustLoading, setIsCustLoading] = useState(false);
  const [isStaffLoading, setIsStaffLoading] = useState(false);
  const [jobs, setJobs] = useState<{ id: string, service: string, quantity: number, price: number, customer: string, staff: string }[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{ id: string, service: string, quantity: number, price: number, customer: string, staff: string } | null>(null);
  const searchParams = useSearchParams(); // To read the current query parameters
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceTemplate: '670befb8e46e44da50d1ceea',
      job: '',
      lineItems: [{ description: 'Transport Fee', quantity: 1, amount: 40 }, { description: '', quantity: 1, amount: 1 }],
      totalAmount: 0,
      publicNote: '',
      customer: '',
      staff: '',
    },
  });

  const calculateTotalAmount = useCallback(() => {
    const total = form.getValues('lineItems').reduce((sum, item) => {
      return sum + (item.amount || 0) * (item.quantity || 0);
    }, 0);
    form.setValue('totalAmount', total);
  }, [form]);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const jobList = await getJobsAction();
        setJobs(jobList);
      } catch (err) {
        console.error(err);
        toast.error("An error occurred while fetching jobs.");
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchJobs();
  }, [getJobsAction]);

  useEffect(() => {
    const jobInitialisedFrom = jobs.find(job => job.id === searchParams.get('jobId'));
    if (jobInitialisedFrom && !form.getValues('job')) {
      form.setValue('job', jobInitialisedFrom.id);
      form.setValue('lineItems.1.description', jobInitialisedFrom.service);
      form.setValue('lineItems.1.quantity', jobInitialisedFrom.quantity);
      form.setValue('lineItems.1.amount', jobInitialisedFrom.price / jobInitialisedFrom.quantity);
      form.setValue('customer', jobInitialisedFrom.customer);
      form.setValue('staff', jobInitialisedFrom.staff);
      
      calculateTotalAmount();
      setSelectedJob(jobInitialisedFrom);
    }
  }, [jobs, searchParams, form, calculateTotalAmount]);

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
      if (result === "No Customer Found") {
        toast.error(result);
        return;
      } else {
        if (result === selectedJob?.customer) {
          toast.success("Customer Found!");
          form.setValue("customer", result);
        } else {
          toast.error("Searched Customer Does Not Match With Selected Job Customer");
        }
      }
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
      if (result === "No Staff Found") {
        toast.error(result);
        return;
      } else {
        toast.success("Staff Found!");
        form.setValue("staff", result);
      }
    } catch (err) {
      console.error(err);
      toast.error("An Error Has Ocurred, Please Try Again!");
    } finally {
      setIsStaffLoading(false);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const lineItemsRef = useRef(form.watch('lineItems'));
  useEffect(() => {
    const lineItems = form.watch('lineItems');
    if (lineItems !== lineItemsRef.current) {
      calculateTotalAmount();
      lineItemsRef.current = lineItems; // Update ref when the value changes
    }
  }, [form, calculateTotalAmount]);

  const onSubmit = async () => {
    setMessage('');
    setErrors({});

    // Format Line Items
    const formatLineItems = form.getValues().lineItems.map(
      (item) => `Description: ${item.description} Quantity: ${item.quantity} Amount: ${item.amount}`
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
          const formData = form.getValues();
          console.log("Form Data:", formData);
          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }}
        className='max-w-2xl w-full flex flex-col gap-4'>
        
        <FormField
          control={form.control}
          name="job"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Job:</FormLabel>
              <FormControl>
                <Select 
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    const selectedJob = jobs.find(job => job.id === value);
                    if (selectedJob) {
                      setSelectedJob(selectedJob);
                      form.setValue('lineItems.1.description', selectedJob.service);
                      form.setValue('lineItems.1.quantity', selectedJob.quantity);
                      form.setValue('lineItems.1.amount', selectedJob.price / selectedJob.quantity);
                      form.setValue('customer', selectedJob.customer);
                      form.setValue('staff', selectedJob.staff);
                      calculateTotalAmount();
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select Job' />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingJobs ? (
                      <SelectItem value="loading" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading jobs...
                      </SelectItem>
                    ) : (
                      jobs.map(job => {
                          return (
                          <SelectItem key={job.id} value={job.id}>
                            {job.id} (Desc: {job.service} Price: ${job.price} Qty: {job.quantity})
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className='mb-4'>
          <FormLabel>Line Items (Description | Quantity | Amount)</FormLabel>
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
                        value={field.value ?? ''}
                        onChange={(event) => {
                          field.onChange(+event.target.value || 1);
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
                        type='number'
                        placeholder='Amount'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(event) => {
                          field.onChange(+event.target.value || 1);
                          calculateTotalAmount();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='button'
                className='bg-red-500 text-white'
                onClick={() => {
                  remove(index);
                  calculateTotalAmount();
                  }}>
                Remove
              </Button>
            </div>
          ))}
          <Button
            type='button'
            className='mt-2 bg-primary text-white'
            onClick={() => append({ description: '', quantity: 1, amount: 1 })}>
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
                    readOnly
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
                <FormLabel>Customer ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Customer Email"
                    {...field}
                    value={field.value ?? ''}
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
                <FormLabel>Staff ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Staff Email"
                    {...field}
                    value={field.value ?? ''}
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
