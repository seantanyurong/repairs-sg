"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InvoiceRow from "./InvoiceRow";

export interface Invoice {
  invoiceId: number;
  customer: string;
  dateDue: Date;
  remainingDue: number;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
}

export default async function OutstandingInvoice({
  invoices,
  customers,
}: {
  invoices: Invoice[];
  customers: Customer[];
}) {
  const outstandingInvoiceRowDisplay = () => {
    return invoices.map((invoice) => {
      const customerId = invoice.customer;
      const customer = customers.find((cust) => cust._id === customerId);
      const customerName = customer ? customer.name : "Unknown customer";
      const customerEmail = customer ? customer.email : "Unknown email";
      return (
        <InvoiceRow
          invoiceId={invoice.invoiceId}
          customerName={customerName}
          contact={customerEmail}
          dateDue={invoice.dateDue.toLocaleDateString("en-GB")}
          remainingDue={invoice.remainingDue}
        />
      );
    });
  };

  const outstandingInvoiceDisplay = () => {
    return (
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Outstanding Invoices</CardTitle>
          <CardDescription>
            Manage your job outstanding invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date Due</TableHead>
                <TableHead>Remaining Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{outstandingInvoiceRowDisplay()}</TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return <>{outstandingInvoiceDisplay()}</>;
}
