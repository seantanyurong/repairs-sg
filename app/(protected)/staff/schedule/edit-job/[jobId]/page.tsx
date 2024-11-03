import { getServices } from '@/lib/actions/services';
import BookingClient from './clientPage';
import { clerkClient, createClerkClient } from "@clerk/nextjs/server";
import { getSingleJob } from '@/lib/actions/jobs';

export default async function Booking({ params }: { params: { jobId: string } }) {
  const job = await getSingleJob(params.jobId);

  console.log(job);

  const jobObject = {
    id: job._id.toString(),
    service: job.service.name,
    quantity: job.quantity,
    jobAddress: job.jobAddress,
    // schedule: job.schedule,
    description: job.description,
    status: job.status,
    customer: job.customer,
    staff: job.staff
  };
  console.log("jobObject");
  console.log(jobObject);
  
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

  return (
    <BookingClient
      job={jobObject}
      services={serviceArray}
      customers={customerArray}
      staff={staffArray}
    />
  );
}
