import CustomerDetailsClient from './clientPage';
import { createClerkClient } from '@clerk/nextjs/server';
import { getQuotationsByCustomerId } from '@/lib/actions/quotations';
import { getJobsByCustomerId } from '@/lib/actions/jobs';
import { getInvoicesByCustomerId } from '@/lib/actions/invoices';

export default async function CustomerDetails({ params }: { params: { customerId: string } }) {
  const customerClerk = createClerkClient({
    secretKey: process.env.CUSTOMER_CLERK_SECRET_KEY as string,
  });

  const customer = await customerClerk.users.getUser(params.customerId);

  const quotations = await getQuotationsByCustomerId(params.customerId);
  const jobs = await getJobsByCustomerId(params.customerId);
  const invoices = await getInvoicesByCustomerId(params.customerId);

  return (
    <CustomerDetailsClient
      customer={{
        id: params.customerId,
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.emailAddresses[0].emailAddress || '',
        status: (customer.publicMetadata.status as string) || '',
        comments: (customer.publicMetadata.comments as string[]) || [],
      }}
      jobs={jobs.map((job) => ({
        _id: job._id.toString(),
        serviceName: job.service.name,
        serviceDescription: job.service.description,
        description: job.description,
        address: job.jobAddress,
        timeStart: job.schedule.timeStart.toLocaleString('en-GB'),
        timeEnd: job.schedule.timeEnd.toLocaleString('en-GB'),
      }))}
      invoices={invoices.map((invoice) => ({
        _id: invoice._id.toString(),
        invoiceId: invoice.invoiceId.toString(),
        lineItems: invoice.lineItems,
        totalAmount: invoice.totalAmount.toString(),
        remainingDue: invoice.remainingDue.toString(),
        paymentStatus: invoice.paymentStatus,
        validityStatus: invoice.validityStatus,
        publicNote: invoice.publicNote,
        customer: invoice.customer,
        job: invoice.job,
      }))}
      quotations={quotations.map((quotation) => ({
        _id: quotation._id.toString(),
        quotationId: quotation.quotationId,
        name: quotation.templateInputs.customer_name,
        description: quotation.description,
        status: quotation.status,
        customer: quotation.customer,
        job: quotation.job,
        totalAmount: quotation.totalAmount?.toString(),
        remainingDue: quotation.remainingDue?.toString(),
        createdAt: quotation.createdAt.toLocaleString('en-GB'),
        updatedAt: quotation.updatedAt.toLocaleString('en-GB'),
      }))}
    />
  );
}
