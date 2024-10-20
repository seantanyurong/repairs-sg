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

interface Invoice {
  _id: string;
  invoiceId: string | number;
  lineItems: string[];
  dateIssued: string | Date;
  dateDue: string | Date;
  totalAmount: string | number;
  remainingDue: string | number;
  paymentStatus: string;
  validityStatus: string;
  publicNote: string;
  customer: string;
  payments: { paymentMethod: string }[] | never[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default async function InvoicesPage() {
  const payment = await getPayments();
  console.log("payment", payment);

  // Fetch Invoices
  const invoices: Invoice[] = await getInvoices();
  // console.log("invoices", invoices);

  // TODO: align with KM
  // Provide a default date if date fields are missing or invalid
  const defaultDate = new Date("1970-01-01T00:00:00Z"); // Default date if missing

  // Convert Date objects to ISO strings
  const serializeInvoice = (invoice: Invoice) => {
    const serializePayment = (payment: { paymentMethod: string }[]) => {
      return [
        {
          paymentMethod: payment[0].paymentMethod,
        },
      ];
    };

    return {
      _id: invoice._id.toString(),
      invoiceId: invoice.invoiceId.toString(),
      lineItems: invoice.lineItems,
      dateIssued: invoice.dateIssued
        ? invoice.dateIssued.toString()
        : defaultDate.toISOString(),
      dateDue: invoice.dateDue
        ? invoice.dateDue.toString()
        : defaultDate.toISOString(),
      totalAmount: invoice.totalAmount,
      remainingDue: invoice.remainingDue,
      paymentStatus: invoice.paymentStatus,
      validityStatus: invoice.validityStatus,
      publicNote: invoice.publicNote,
      customer: invoice.customer,
      createdAt: invoice.createdAt
        ? invoice.createdAt.toString()
        : defaultDate.toISOString(),
      updatedAt: invoice.updatedAt
        ? invoice.updatedAt.toString()
        : defaultDate.toISOString(),
      payments:
        invoice.payments && invoice.payments.length > 0
          ? serializePayment(invoice.payments)
          : [],
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
