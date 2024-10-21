import { getInvoice } from "@/lib/actions/invoices";
import EditInvoiceClient from "./clientPage";
import { clerkClient, createClerkClient } from "@clerk/nextjs/server";
import { getCustomerById } from "@/lib/actions/customers";

export default async function EditInvoice({
  params,
}: {
  params: { invoiceId: number };
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

  const transformLineItems = invoice.lineItems.map((lineItem: string) => {
    const regex =
      /Description:\s*([\w\s]+)\s*Quantity:\s*(\d+)\s*Amount:\s*(\d+)/;
    const match = lineItem.match(regex);
    if (match) {
      const description = match[1].trim();
      const quantity = parseInt(match[2], 10);
      const amount = parseInt(match[3], 10);

      return {
        description: description,
        quantity: quantity,
        amount: amount,
      };
    } else {
      console.log("Invalid line item format");
    }
  });

  const getCustomerEmail = async (customer: string) => {
    "use server";
    const customerObject = JSON.parse(await getCustomerById(customer));
    return customerObject.emailAddresses[0].emailAddress as string;
  };

  const getStaffEmail = async (staffId: string) => {
    "use server";
    const staff = await clerkClient().users.getUser(staffId);

    if (!staff) throw new Error("No customer found with that id");

    return (staff.primaryEmailAddress?.emailAddress as string) || "";
  };

  return (
    <EditInvoiceClient
      invoice={{
        _id: invoice._id.toString(),
        lineItems: transformLineItems,
        dateIssued: invoice.dateIssued,
        dateDue: invoice.dateDue,
        totalAmount: invoice.totalAmount,
        remainingDue: invoice.remainingDue,
        paymentStatus: invoice.paymentStatus,
        validityStatus: invoice.validityStatus,
        publicNote: invoice.publicNote,
        customer: invoice.customer,
        lastUpdatedBy: invoice.lastUpdatedBy,
      }}
      getCustomerAction={getCustomerAction}
      getStaffAction={getStaffAction}
      getCustomerEmail={getCustomerEmail}
      getStaffEmail={getStaffEmail}
      currCustEmail={await getCustomerEmail(invoice.customer)}
      currStaffEmail={await getStaffEmail(invoice.lastUpdatedBy)}
    />
  );
}
