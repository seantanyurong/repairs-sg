import { auth, createClerkClient, EmailAddress } from "@clerk/nextjs/server";
import {
  getInvoices,
  getOverdueInvoiceByStaffId,
} from "@/lib/actions/invoices";
import { getPayments } from "@/lib/actions/payments";
import Invoices from "./_components/Invoices";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: EmailAddress[];
}

interface CustomerMap {
  [key: string]: {
    _id: string;
    firstName: string;
    lastName: string;
    emailAddresses: string[];
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
  job: string;
  payments: { paymentMethod: string }[] | never[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default async function InvoicesPage() {
  const payment = await getPayments();
  console.log("payment", payment);

  const { userId } = auth();

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
    const serializeJob = (job: string) => {
      return job.toString();
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
      job: invoice.job ? serializeJob(invoice.job) : "",
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
      _id: user.id.toString(),
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      emailAddresses: user.emailAddresses.map((email) => email.emailAddress),
    };
  });
  // console.log("custMap", customerMap);

  // Outstanding Invoice
  const overdueInvoicesByStaff = await getOverdueInvoiceByStaffId(
    userId as string
  );
  const overdueInvoicesMap = overdueInvoicesByStaff.map((invoice) => ({
    invoiceId: invoice.invoiceId,
    customer: invoice.customer,
    dateDue: invoice.dateDue,
    remainingDue: invoice.remainingDue,
  }));

  return (
    <Invoices
      initialInvoices={serializedInvoices}
      customerMap={customerMap}
      overdueInvoices={overdueInvoicesMap}
    />
  );
}
