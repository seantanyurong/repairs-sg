'use client';

import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from '@/components/ui/select';
import { updateJob } from '@/lib/actions/jobs';
import { useUser } from '@clerk/clerk-react';
import { format, addHours, startOfDay, addDays, isAfter } from 'date-fns';

const formSchema = z.object({
  service: z.string().min(1),
  quantity: z.number().min(1),
  jobAddress: z.string().min(1),
  schedule: z.string(),
  description: z.string(),
  customer: z.string(),
  staff: z.string(),
  vehicle: z.string(),
});

type Customer = {
  id: string;
  name: string;
};

type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  volumeDiscountPercentage: number;
  status: string;
};

type Schedule = {
  timeStart: Date;
  timeEnd: Date;
};

type Job = {
  id: string;
  service: string;
  quantity: number;
  jobAddress: string;
  schedule: Schedule;
  description: string;
  status: string;
  customer: string;
  staff: string;
  vehicle: string;
};

type Staff = {
  id: string;
  name: string;
}

type VehicleFromArray = {
  id: string;
  licencePlate: string;
}

type JobFromArray = {
  schedule: Schedule;
  status: string;
  staff: string;
  vehicle: string;
}

type DateRange = {
  start: Date;
  end: Date;
}

type LeaveFromArray = {
  type: string;
  status: string;
  dateRange: DateRange;
  requesterId: string;
}

const findAvailableStaffForClientComponent = (staffArray: Staff[], jobs: JobFromArray[], leaves: LeaveFromArray[], timeStart: Date, timeEnd: Date) => {
  // 1. Filter jobs and leaves that overlap with the time range
  const overlappingJobs = jobs.filter((job) => (job.status !== 'Completed' && job.status !== 'Cancelled') && job.schedule.timeStart < timeEnd && job.schedule.timeEnd > timeStart);
  
  timeStart = new Date(timeStart.toISOString().substring(0, 10));
  timeEnd = new Date(timeEnd.toISOString().substring(0, 10));
  const overlappingLeaves = leaves.filter((leave) => 
    { const leaveStart = new Date(leave.dateRange.start.toISOString().substring(0, 10));
      const leaveEnd = new Date(leave.dateRange.end.toISOString().substring(0, 10));        
      return leaveStart <= timeEnd && leaveEnd >= timeStart && leave.status === 'APPROVED'});

  // 2. Extract staff involved in jobs and leaves
  const overlappingStaffFromJobs = overlappingJobs.map((job) => job.staff);  // Staff names from jobs
  const overlappingStaffFromLeaves = overlappingLeaves.map((leave) => leave.requesterId).map((id) => id = staffArray.find((staff) => staff.id === id)?.name || '');  // Staff names from leaves

  // 3. Combine staff from jobs and leaves
  const overlappingStaff = [...overlappingStaffFromJobs, ...overlappingStaffFromLeaves];

  // 4. Filter available staff (those not in overlapping jobs or leaves)
  const availableStaff = staffArray.filter((staff) => !overlappingStaff.includes(staff.name));
  return availableStaff;
};

const findAvailableVehiclesForClientComponent = (vehicleArray: VehicleFromArray[], jobs: JobFromArray[], timeStart: Date, timeEnd: Date) => {
  // 1. Filter jobs that overlap with the time range
  const overlappingJobs = jobs.filter((job) => (job.status !== 'Completed' && job.status !== 'Cancelled') && job.schedule.timeStart < timeEnd && job.schedule.timeEnd > timeStart);
  
  timeStart = new Date(timeStart.toISOString().substring(0, 10));
  timeEnd = new Date(timeEnd.toISOString().substring(0, 10));

  // 2. Extract staff involved in jobs and leaves
  const overlappingVehicleFromJobs = overlappingJobs.map((job) => job.vehicle);  // vehicle licenceplates from jobs

  // 4. Filter available vehicles
  const availableVehicles = vehicleArray.filter((vehicle) => !overlappingVehicleFromJobs.includes(vehicle.licencePlate));
  return availableVehicles;
};

export default function BookingClient({ 
  job,
  services,
  customerArray,
  staffArray,
  vehicleArray,
  jobs,
  leaves,
}:{
  job: Job,
  services: Service[],
  customerArray: Customer[],
  staffArray: Staff[],
  vehicleArray: { id: string; licencePlate: string }[],
  jobs: JobFromArray[],
  leaves: LeaveFromArray[],
}) {

  const originalService = services.find((service) => service.name === job.service);
  const originalCustomer = customerArray.find((customer) => customer.id === job.customer) || customerArray[0];  // fallback value will not be used
  const originalStaff = staffArray.find((staff) => staff.id === job.staff);
  const originalVehicle = vehicleArray.find((vehicle) => vehicle.id === job.vehicle);

  const filteredStaff = findAvailableStaffForClientComponent(staffArray, jobs, leaves, job.schedule.timeStart, job.schedule.timeEnd);
  const filteredVehicles = findAvailableVehiclesForClientComponent(vehicleArray, jobs, job.schedule.timeStart, job.schedule.timeEnd);
  const originalSchedule = {
    value: JSON.stringify({
      timeStart: format(job.schedule.timeStart, "yyyy-MM-dd'T'HH:mm:ss"),
      timeEnd: format(job.schedule.timeEnd, "yyyy-MM-dd'T'HH:mm:ss"),
    }), // Pass both start and end time in the value
    label: format(job.schedule.timeStart, 'MMMM d, yyyy HH:mm') + ' - ' + format(job.schedule.timeEnd, 'HH:mm'),
  };

  const [selectedVehicle, setSelectedVehicle] = useState(originalVehicle);
  const [selectedStaff, setSelectedStaff] = useState(originalStaff); 
  const [service, setService] = useState(originalService);
  const [availableStaff, setAvailableStaff] = useState(filteredStaff);
  const [availableVehicles, setAvailableVehicles] = useState(filteredVehicles);
  const [message, setMessage] = useState('');
  const [schedule, setSchedule] = useState(originalSchedule.value);
  const [errors, setErrors] = useState({});
  const [priceQty, setPriceQty] = useState(job.quantity);
  const router = useRouter();
  const { isLoaded } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: job.service,
      quantity: job.quantity,
      jobAddress: job.jobAddress,
      description: job.description,
      customer: job.customer,
      schedule: originalSchedule.label,
      staff: job.staff || '',
      vehicle: job.vehicle || '',
    },
  });

  console.log(form.getValues());

  // Function to generate 2-hour intervals for the next 3 days
  const generateScheduleOptions = () => {
    const options = [];
    const startDate = addDays(new Date(), 1); // Start from tomorrow
    const endDate = addDays(startDate, 3); // Up to 3 days from tomorrow

    let currentDate = startOfDay(startDate); // Start at 00:00 tomorrow
    while (isAfter(endDate, currentDate)) {
      // Create time slots from 10:00 to 20:00 each day
      for (let hour = 10; hour < 20; hour += 2) {
        const startTime = addHours(startOfDay(currentDate), hour);
        const endTime = addHours(startTime, 2);

        options.push({
          value: JSON.stringify({
            timeStart: format(startTime, "yyyy-MM-dd'T'HH:mm:ss"),
            timeEnd: format(endTime, "yyyy-MM-dd'T'HH:mm:ss"),
          }), // Pass both start and end time in the value
          label: format(startTime, 'MMMM d, yyyy HH:mm') + ' - ' + format(endTime, 'HH:mm'),
        });
      }
      currentDate = addDays(currentDate, 1); // Move to the next day
    }

    return options;
  };

  const scheduleOptions = generateScheduleOptions();

  const itemPrice = service!.price - (service!.price * (priceQty - 1) * service!.volumeDiscountPercentage) / 100;
  const itemPriceRounded = Math.round(itemPrice * 100) / 100;
  const subtotalPrice = itemPrice * priceQty;
  const subtotalPriceRounded = Math.round(subtotalPrice * 100) / 100;
  const gstPrice = 0.09 * itemPrice * priceQty;
  const gstPriceRounded = Math.round(gstPrice * 100) / 100;
  const totalPrice = subtotalPrice + gstPrice;
  const totalPriceRounded = Math.round(totalPrice * 100) / 100;

  const onSubmit = async () => {
    setMessage('');
    setErrors({});
    const formValues = form.getValues();
    const result = await updateJob({
      ...formValues,
      serviceId: service!._id.toString(),
      schedule: schedule,
      price: totalPriceRounded,
      _id: job.id,
    });
    if (result?.errors) {
      setMessage(result.message);
      setErrors(result.errors);
      return;
    } else {
      setMessage(result.message);
      router.refresh();
      form.reset(form.getValues());
      router.push('/staff/schedule?filters=all');
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className='flex w-full flex-col'>
      <div className='flex flex-col sm:gap-4 sm:py-4'>
        <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
          <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
            <div className='grid gap-4 md:grid-cols-4'>
            </div>
              <Card x-chunk='dashboard-05-chunk-3'>
                <CardHeader className='px-7'>
                  <CardTitle>Edit a Job</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }}
                      className='max-w-md w-full flex flex-col gap-4'>
                      {/* Service Field */}
                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service</FormLabel>
                            <Select
                              onValueChange={(selectedServiceName) => {
                                // Find the selected service by name
                                const selectedService = services.find(
                                  (service) => service.name === selectedServiceName
                                );
                                // Change the state to the selected service
                                if (selectedService) {
                                  setService(selectedService);
                                  field.onChange(selectedServiceName); // Update form field value
                                }
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={service!.name} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem key={service.name} value={service.name}>
                                    {service.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Quantity Field */}
                      <FormField
                        control={form.control}
                        name='quantity'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                min='1'
                                placeholder='Enter quantity'
                                {...field}
                                onChange={(event) => {
                                  field.onChange(+event.target.value);
                                  setPriceQty(+event.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Job Address Field */}
                      <FormField
                        control={form.control}
                        name='jobAddress'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Address</FormLabel>
                            <FormControl>
                              <Input placeholder='Enter job address' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Schedules Field */}
                      <FormField
                      control={form.control}
                      name='schedule'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Booking Timing</FormLabel>
                          <Select
                              onValueChange={(selectedSchedule) => {
                                  const formattedSchedule = JSON.parse(selectedSchedule);
                                  setAvailableStaff(findAvailableStaffForClientComponent(staffArray, jobs, leaves, new Date(formattedSchedule.timeStart), new Date(formattedSchedule.timeEnd)));
                                  setAvailableVehicles(findAvailableVehiclesForClientComponent(vehicleArray, jobs, new Date(formattedSchedule.timeStart), new Date(formattedSchedule.timeEnd)));
                                  setSelectedStaff(undefined);
                                  setSelectedVehicle(undefined);
                                  form.setValue('staff', '');
                                  form.setValue('vehicle', '');

                                  setSchedule(selectedSchedule);
                                  field.onChange(selectedSchedule);
                              }}
                            >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={originalSchedule.label} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {scheduleOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                      {/* Description Field */}
                      <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                              <Textarea placeholder='Enter notes' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Customer Field */}
                      <FormField
                        control={form.control}
                        name='customer'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Customer</FormLabel>
                            <Select onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={originalCustomer.name} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {customerArray.map((customer) => (
                                  <SelectItem key={customer.id} value={customer.id}>
                                    {customer.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Staff Field */}
                      <FormField
                        control={form.control}
                        name='staff'
                        render={({ field }) => {
                          return (
                          <FormItem>
                            <FormLabel>Staff</FormLabel>
                            <Select onValueChange={(field.onChange)}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={selectedStaff?.name || 'Select a Staff'} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableStaff.map((staff) => (
                                  <SelectItem key={staff.id} value={staff.id}>
                                    {staff.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}}
                      />
                      {/* Vehicle Field */}
                      <FormField
                        control={form.control}
                        name='vehicle'
                        render={({ field }) => {
                          return (
                          <FormItem>
                            <FormLabel>Vehicle</FormLabel>
                            <Select onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={selectedVehicle?.licencePlate || 'Select a Vehicle'} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableVehicles.map((vehicle) => (
                                  <SelectItem key={vehicle.id} value={vehicle.id}>
                                    {vehicle.licencePlate}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}}
                      />
                      <Button type='submit' className='w-full'>
                        Save Job
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
                </CardContent>
              </Card>
          </div>
          <div>
            <Card className='overflow-hidden' x-chunk='dashboard-05-chunk-4'>
              <CardHeader className='flex flex-row items-start bg-muted/50'>
                <div className='grid gap-0.5'>
                  <CardTitle className='group flex items-center gap-2 text-lg'>
                    Order
                    <Button
                      size='icon'
                      variant='outline'
                      className='h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100'>
                      <Copy className='h-3 w-3' />
                      <span className='sr-only'>Copy Order ID</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>Estimated Cost</CardDescription>
                </div>
              </CardHeader>
              <CardContent className='p-6 text-sm'>
                <div className='grid gap-3'>
                  <div className='font-semibold'>Order Details</div>
                  <ul className='grid gap-3'>
                    <li className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>
                        {service!.name} x <span>{priceQty}</span> ($
                        {itemPriceRounded} / service)
                      </span>
                      <span>${subtotalPriceRounded}</span>
                    </li>
                  </ul>
                  <Separator className='my-2' />
                  <ul className='grid gap-3'>
                    <li className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Subtotal</span>
                      <span>${subtotalPriceRounded}</span>
                    </li>
                    <li className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>GST</span>
                      <span>${gstPriceRounded}</span>
                    </li>
                    <li className='flex items-center justify-between font-semibold'>
                      <span className='text-muted-foreground'>Total</span>
                      <span>${totalPriceRounded}</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
