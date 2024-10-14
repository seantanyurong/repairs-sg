import { createClerkClient } from "@clerk/nextjs/server";
import { getInvoices } from "@/lib/actions/invoices";
import { getPayments } from "@/lib/actions/payments";
import Invoices from "./_components/Invoices";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

interface CustomerMap {
  [key: string]: {
    firstName: string;
    lastName: string;
  };
}

export default async function InvoicesPage() {
  const payment = await getPayments();
  console.log("payment", payment);

  // Fetch Invoices
  const invoices = await getInvoices();
  // console.log("invoices", invoices);

  // TODO: align with KM
  // Provide a default date if date fields are missing or invalid
  const defaultDate = new Date("1970-01-01T00:00:00Z").toISOString(); // Default date if missing

  // Convert Date objects to ISO strings
  const serializeInvoice = (invoice: any) => {
    // Convert the Mongoose document to a plain object
    const plainInvoice = invoice.toObject();

    return {
      ...plainInvoice,
      // Ensure _id and dates are serialized to strings
      _id: plainInvoice._id.toString(),
      dateIssued: plainInvoice.dateIssued
        ? plainInvoice.dateIssued.toISOString()
        : defaultDate,
      dateDue: plainInvoice.dateDue
        ? plainInvoice.dateDue.toISOString()
        : defaultDate,
      createdAt: plainInvoice.createdAt
        ? plainInvoice.createdAt.toISOString()
        : defaultDate,
      updatedAt: plainInvoice.updatedAt
        ? plainInvoice.updatedAt.toISOString()
        : defaultDate,
    };
  };
  const serializedInvoices = invoices.map(serializeInvoice);
  // console.log("serializedInvoices", serializedInvoices);

  // Fetch Customers
  const custClerk = createClerkClient({
    secretKey: process.env.CUSTOMER_CLERK_SECRET_KEY,
  });
  const customers = await custClerk.users.getUserList();
  const customerMap: CustomerMap = {};
  customers.data.forEach((user: User) => {
    customerMap[user.id] = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    };
  });
  // console.log("custMap", customerMap);

  return (
    <Invoices initialInvoices={serializedInvoices} customerMap={customerMap} />
  );
}
