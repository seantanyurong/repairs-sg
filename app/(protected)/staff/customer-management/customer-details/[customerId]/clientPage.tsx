'use client';

import { Label } from '@radix-ui/react-label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import JobRow from './_components/JobRow';
import InvoiceRow from './_components/InvoiceRow';
import { DataTable } from '@/components/ui/data-table';
import { quotationColumns } from './_components/QuotationColumns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addCommentToCustomer } from '@/lib/actions/customers';
import { useState } from 'react';

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
    comments: string[];
  };
  jobs: {
    _id: string;
    serviceName: string;
    serviceDescription: string;
    description: string;
    address: string;
    timeStart: string;
    timeEnd: string;
  }[];
  invoices: {
    _id: string;
    invoiceId: string | number;
    lineItems: string[];
    totalAmount: string | number;
    remainingDue: string | number;
    paymentStatus: string;
    validityStatus: string;
    publicNote: string;
    customer: string;
    job: string;
  }[];
  quotations: {
    _id: string;
    quotationId: number;
    name: string;
    description: string;
    status: string;
    customer: string;
    job: string;
    totalAmount: string | number;
    remainingDue: string | number;
    createdAt: string;
    updatedAt: string;
  }[];
}) {
  const [additionalComment, setAdditionalComment] = useState<string>('');

  const jobTableDisplay = () => {
    if (jobs.length === 0) {
      return <div className='mt-4'>No jobs found</div>;
    }

    return jobs.map((job) => {
      return (
        <JobRow
          key={job._id.toString()}
          id={job._id.toString()}
          serviceName={job.serviceName}
          description={job.description}
          address={job.address}
          timeStart={job.timeStart}
          timeEnd={job.timeEnd}
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
          customer={fullName}
          job={invoice.job}
          totalAmount={invoice.totalAmount.toString()}
          remainingDue={invoice.remainingDue.toString()}
          lineItems={invoice.lineItems}
          paymentStatus={invoice.paymentStatus}
          validityStatus={invoice.validityStatus}
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
      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
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
        </CardContent>
      </Card>

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
                <TableHead>Customer</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Remaining Due</TableHead>
                <TableHead>Line Items</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Status</TableHead>
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
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-12'>
            {customer.comments.map((comment) => (
              <div key={comment} className='flex gap-4 items-center'>
                <p className='mt-2'>{comment}</p>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addCommentToCustomer(customer.id, additionalComment);
              setAdditionalComment('');
            }}>
            <div className='flex gap-4 items-center'>
              <Label htmlFor='username' className='text-right hidden'>
                Comment
              </Label>
              <Input
                placeholder='Enter comment...'
                className='w-full'
                value={additionalComment}
                onChange={(e) => setAdditionalComment(e.target.value)}
              />
            </div>
            <Button type='submit' className='w-full mt-4'>
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
