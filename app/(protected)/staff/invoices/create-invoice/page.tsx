import { createClerkClient, clerkClient } from "@clerk/nextjs/server";
import { getJobs } from "@/lib/actions/jobs";
import { getService } from "@/lib/actions/services";
import CreateInvoiceClient from "./clientPage";
import { getPayments } from "@/lib/actions/payments";


const CreateInvoice = async () => {
  const getCustomerAction = async (email: string) => {
    "use server";
    // Fetch Customers
    const custClerk = createClerkClient({ secretKey: process.env.CUSTOMER_CLERK_SECRET_KEY });
    const customer = await custClerk.users.getUserList({ emailAddress: [email] });
    return customer.totalCount === 0 ? "No Customer Found" : customer.data[0].id.toString();
  };

  const getStaffAction = async (email: string) => {
    "use server";
    // Fetch Staff
    const staff = await clerkClient().users.getUserList({ emailAddress: [email] });
    return staff.totalCount === 0 ? "No Staff Found" : staff.data[0].id.toString();
  };

  const getJobsAction = async () => {
    "use server";
    const jobs = await getJobs();
    const allJobs = await Promise.all(jobs.map(async (job) => {
      const service = await getService(job.service.toString());

      return {
        id: job._id.toString(),
        service: service?.name || "Unknown",
        quantity: job.quantity,
        price: job.price,
        customer: job.customer,
        staff: job.staff,
      };
    }))
    
    return allJobs.reverse();
  }

  getPayments();

  return (
    <CreateInvoiceClient
      getCustomerAction={getCustomerAction}
      getStaffAction={getStaffAction}
      getJobsAction={getJobsAction}
    />
  );
};

export default CreateInvoice;