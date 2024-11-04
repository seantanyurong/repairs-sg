'use client';

import { Label } from '@radix-ui/react-label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import JobRow from './_components/JobRow';
import InvoiceRow from './_components/InvoiceRow';
import { DataTable } from '@/components/ui/data-table';
import { quotationColumns } from './_components/QuotationColumns';

export default function CustomerDetailsClient({
  customer,
  jobs,
  invoices,
  quotations,
}: {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
  };
  jobs: {
    _id: string;
    service: {
      name: string;
    };
    description: string;
    jobAddress: string;
    schedule: {
      timeStart: Date;
      timeEnd: Date;
    };
  }[];
  invoices: {
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
  }[];
  quotations: {
    _id: string;
    name: string;
    description: string;
    status: string;
    customer: string;
    job: string;
    totalAmount: string | number;
    remainingDue: string | number;
    createdAt: string | Date;
    updatedAt: string | Date;
  }[];
}) {
  const jobTableDisplay = () => {
    if (jobs.length === 0) {
      return <div className='mt-4'>No jobs found</div>;
    }

    return jobs.map((job) => {
      return (
        <JobRow
          key={job._id.toString()}
          id={job._id.toString()}
          serviceName={job.service.name}
          description={job.description}
          address={job.jobAddress}
          timeStart={job.schedule.timeStart.toLocaleString('en-GB')}
          timeEnd={job.schedule.timeEnd.toLocaleString('en-GB')}
        />
      );
    });
  };

  const invoiceDisplay = () => {
    if (invoices.length === 0) {
      return <div className='mt-4'>No invoices found</div>;
    }

    return invoices.map((invoice) => {
      const fullName = customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown';

      return (
        <InvoiceRow
          key={invoice._id.toString()}
          invoiceId={invoice.invoiceId.toString()}
          dateIssued={invoice.dateIssued.toString()}
          customer={fullName}
          job={invoice.job}
          totalAmount={invoice.totalAmount.toString()}
          remainingDue={invoice.remainingDue.toString()}
          lineItems={invoice.lineItems}
          paymentStatus={invoice.paymentStatus}
          validityStatus={invoice.validityStatus}
          paymentMethod={invoice.payments[0]?.paymentMethod}
        />
      );
    });
  };

  const quotationDisplay = () => {
    return (
      <CardContent>
        <DataTable
          columns={quotationColumns}
          data={JSON.parse(JSON.stringify(quotations))}
          noResultsMessage='No quotations found.'
          filterColumn='name'
        />
      </CardContent>
    );
  };

  return (
    <>
      <div className='grid gap-9 py-9'>
        <div className='flex gap-4 items-center'>
          <Label htmlFor='username' className='text-right'>
            First Name
          </Label>
          <p className='text-sm text-muted-foreground col-span-3'>{customer.firstName || '-'}</p>
        </div>
        <div className='flex gap-4 items-center'>
          <Label htmlFor='username' className='text-right'>
            Last Name
          </Label>
          <p className='text-sm text-muted-foreground'>{customer.lastName || '-'}</p>
        </div>
        <div className='flex gap-4 items-center'>
          <Label htmlFor='username' className='text-right'>
            Email
          </Label>
          <p className='text-sm text-muted-foreground col-span-3 break-words'>{customer.email || '-'}</p>
        </div>
        <div className='flex gap-4 items-center'>
          <Label htmlFor='status' className='text-right'>
            Status
          </Label>
          <p className='text-sm text-muted-foreground col-span-3 break-words'>{customer.status || '-'}</p>
        </div>
      </div>
      <Card x-chunk='dashboard-06-chunk-0'>
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{jobTableDisplay()}</TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card x-chunk='dashboard-06-chunk-0'>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Remaining Due</TableHead>
                <TableHead>Line Items</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{invoiceDisplay()}</TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card x-chunk='dashboard-06-chunk-0'>
        <CardHeader>
          <CardTitle>Quotations</CardTitle>
        </CardHeader>
        <CardContent>{quotationDisplay()}</CardContent>
      </Card>
    </>
  );
}
