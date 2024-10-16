import { createClerkClient, clerkClient } from "@clerk/nextjs/server";
// import { getSchedules } from "@/lib/actions/schedules";
// import { getServices } from "@/lib/actions/services";
// import { getOneQuoteTemplate } from "@/lib/actions/quoteTemplates";
import CreateInvoiceClient from "./clientPage";


const CreateInvoice = async () => {
  // Fetch Template
  // const invoiceTemplate = await getOneQuoteTemplate("670befb8e46e44da50d1ceea");

  // Fetch Services and Schedules
  // const schedules = await getSchedules();
  // const services = await getServices();

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

  // const getJobAction = async (id: number) => {
  //   "use server";
  //   // Fetch Job (TODO)
  // }

  return (
    <CreateInvoiceClient
      // template={JSON.parse(invoiceTemplate)}
      getCustomerAction={getCustomerAction}
      getStaffAction={getStaffAction}
      // getJobAction={getJobAction}
    />
  );
};

export default CreateInvoice;