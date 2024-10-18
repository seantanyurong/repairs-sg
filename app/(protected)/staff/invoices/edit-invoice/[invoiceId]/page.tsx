import { getInvoice } from "@/lib/actions/invoices";
import EditInvoiceClient from "./clientPage";
import { clerkClient, createClerkClient } from "@clerk/nextjs/server";

export default async function EditInvoice({
  params,
}: {
  params: { invoiceId: string };
}) {
  const invoice = await getInvoice(params.invoiceId);

  const getCustomerAction = async (email: string) => {
    "use server";
    // Fetch Customers
    const custClerk = createClerkClient({
      secretKey: process.env.CUSTOMER_CLERK_SECRET_KEY,
    });
    const customer = await custClerk.users.getUserList({
      emailAddress: [email],
    });
    return customer.totalCount === 0
      ? "No Customer Found"
      : customer.data[0].id.toString();
  };

  const getStaffAction = async (email: string) => {
    "use server";
    // Fetch Staff
    const staff = await clerkClient().users.getUserList({
      emailAddress: [email],
    });
    return staff.totalCount === 0
      ? "No Staff Found"
      : staff.data[0].id.toString();
  };

  return (
    <EditInvoiceClient
      invoice={{
        _id: invoice._id.toString(),
        lineItems: invoice.lineItems.map(
          (lineItem: { description: string; quantity: number }) => ({
            description: lineItem.description,
            quantity: lineItem.quantity,
          }),
        ),
        totalAmount: invoice.totalAmount,
        paymentStatus: invoice.paymentStatus,
        validityStatus: invoice.validityStatus,
        publicNote: invoice.publicNote,
        customer: invoice.customer,
        staff: invoice.staff,
      }}
      getCustomerAction={getCustomerAction}
      getStaffAction={getStaffAction}
    />
  );
}
