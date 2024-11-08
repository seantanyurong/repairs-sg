import { getServices } from '@/lib/actions/services';
import BookingClient from './clientPage';
import { clerkClient, createClerkClient } from "@clerk/nextjs/server";
import { getJobsWithServiceAndVehicle, getSingleJob } from '@/lib/actions/jobs';
import { getLeaves } from '@/lib/actions/leave';
import { getVehicles } from '@/lib/actions/vehicles';

export default async function Booking({ params }: { params: { jobId: string } }) {
  const job = await getSingleJob(params.jobId);
  console.log(job);

  const jobs = await getJobsWithServiceAndVehicle();
  const leaves = await getLeaves();
  const staff = await clerkClient().users.getUserList();

  // convert this PaginatedResourceResponse<User[]>into an array
  const staffArray = staff.data.map((staff) => {
    return { id: String(staff.id).trim(), name: staff.firstName + ' ' + staff.lastName };
  });
  const custClerk = createClerkClient({
    secretKey: process.env.CUSTOMER_CLERK_SECRET_KEY,
  });
  const customers = await custClerk.users.getUserList();

  // convert this PaginatedResourceResponse<User[]>into an array
  const customerArray = customers.data.map((customer) => {
    return { id: String(customer.id).trim(), name: customer.firstName + ' ' + customer.lastName };
  });

  // convert the staff attribute in jobs to hold the name of the staff instead of the id
  jobs.map((job) => {
    job.staff = staffArray.find((staff) => staff.id === job.staff)?.name || '';
    job.customer = customerArray.find((customer) => customer.id === job.customer)?.name || '';
  });

  console.log(jobs.length);

  const jobsArray = jobs
  .filter((job) => job._id.toString() !== params.jobId)
  .map((job) => {
    return {
      schedule: job.schedule,
      status: job.status,
      staff: job.staff,
      vehicle: job.vehicle?.licencePlate || '',
    };
  });

  const leavesArray = leaves.map((leave) => {
    return {
      type: leave.type,
      status: leave.status,
      dateRange: leave.dateRange,
      requesterId: leave.requesterId,
    };
  });


  const vehicles = await getVehicles();
  const vehicleArray = vehicles
  .filter((vehicle) => vehicle.status === 'Active')
  .map((vehicle) => {
    return { id: vehicle._id.toString(), licencePlate: vehicle.licencePlate };
  });


  const jobObject = {
    id: job._id.toString(),
    service: job.service.name,
    quantity: job.quantity,
    jobAddress: job.jobAddress,
    schedule: job.schedule,
    description: job.description,
    status: job.status,
    customer: job.customer,
    staff: job.staff,
    vehicle: job.vehicle?._id.toString(),
  };
  
  const services = await getServices();

  // convert this into an array
  const serviceArray = services.map((service) => {
    return { 
      _id: service._id.toString(),
        name: service.name,
        description: service.description,
        price: service.price,
        volumeDiscountPercentage: service.volumeDiscountPercentage,
        status: service.status,
     };
  });

  return (
    <BookingClient
      job={jobObject}
      services={serviceArray}
      customerArray={customerArray}
      staffArray={staffArray}
      vehicleArray={vehicleArray}
      jobs={jobsArray}
      leaves={leavesArray}
    />
  );
}
