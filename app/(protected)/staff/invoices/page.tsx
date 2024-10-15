import Link from 'next/link';
import { createClerkClient } from '@clerk/nextjs/server';
import { getInvoices } from '@/lib/actions/invoices';
import { getPayments } from '@/lib/actions/payments';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvoiceRow from './_components/InvoiceRow';

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

export default async function Invoices() {
  // Fetch Payment
  // const payments = await getPayments();

  // Fetch Invoice
  const invoices = await getInvoices();

  // Fetch Customers
  const custClerk = createClerkClient({ secretKey: process.env.CUSTOMER_CLERK_SECRET_KEY });
  const customers = await custClerk.users.getUserList();
  const customerMap: CustomerMap = {};
  customers.data.forEach((user: User) => {
    customerMap[user.id] = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    };
  });

  const invoiceDisplay = (validityStatus?: string) => {
    if (validityStatus === 'all') {
      return invoices.map((invoice) => {
        const customer = customerMap[invoice.customer];
        const fullName = customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown';

        return (
          <InvoiceRow
            key={invoice.invoiceId.toString()}
            invoiceId={invoice.invoiceId.toString()}
            dateIssued={invoice.dateIssued.toString()}
            customer={fullName}
            totalAmount={invoice.totalAmount.toString()}
            lineItems={invoice.lineItems}
            paymentStatus={invoice.payments[0]? "Paid" : "Unpaid"}
            validityStatus={invoice.validityStatus}
            paymentMethod={invoice.payments[0]?.paymentMethod}
          />
        );
      });
    }

    return invoices
      .filter((invoice) => invoice.validityStatus === validityStatus)
      .map((invoice) => {
        const customer = customerMap[invoice.customer];
        const fullName = customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown';

        return (
          <InvoiceRow
          key={invoice.invoiceId.toString()}
          invoiceId={invoice.invoiceId.toString()}
          dateIssued={invoice.dateIssued.toString()}
          customer={fullName}
          totalAmount={invoice.totalAmount.toString()}
          lineItems={invoice.lineItems}
          paymentStatus={invoice.paymentStatus}
          validityStatus={invoice.validityStatus}
          paymentMethod={invoice.payments[0]?.paymentMethod}
          />
        );
      });
  };

  const invoiceCount = (validityStatus?: string) => {
    if (validityStatus === 'all') {
      return invoices.length;
    }

    return invoices.filter((invoice) => invoice.validityStatus === validityStatus).length;
  };

  const cardDisplay = (validityStatus?: string) => {
    if (invoices.length === 0) {
      return <div className='mt-4'>No Invoices Found</div>;
    }

    return (
      <Card x-chunk='dashboard-06-chunk-0'>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Manage Customer Invoices and Edit Details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Line Items</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{invoiceDisplay(validityStatus)}</TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className='text-xs text-muted-foreground'>
            Showing{' '}
            <strong>
              {invoiceCount(validityStatus) === 0 ? '0' : '1'}-{invoiceCount(validityStatus)}
            </strong>{' '}
            of <strong>{invoiceCount(validityStatus)}</strong> Invoices
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <Tabs defaultValue='all'>
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='active'>Active</TabsTrigger>
          <TabsTrigger value='draft'>Draft</TabsTrigger>
          <TabsTrigger value='void' className='hidden sm:flex'>Void</TabsTrigger>
        </TabsList>
        <div className='ml-auto flex items-center gap-2'>
          <Link href='/staff/invoices/create-invoice'>
            <Button size='sm' className='h-8 gap-1'>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Create Invoices</span>
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent value='all'>{cardDisplay('all')}</TabsContent>
      <TabsContent value='active'>{cardDisplay('active')}</TabsContent>
      <TabsContent value='draft'>{cardDisplay('draft')}</TabsContent>
      <TabsContent value='void'>{cardDisplay('void')}</TabsContent>
    </Tabs>
  );
}
