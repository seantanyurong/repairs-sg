"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InvoiceRow from "./InvoiceRow";
import SearchBar from "@/app/(protected)/_components/SearchBar";

interface Invoice {
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

interface InvoicesProps {
  initialInvoices: Invoice[];
  customerMap: { [key: string]: { firstName: string; lastName: string } };
}

export default function Invoices({
  initialInvoices,
  customerMap,
}: InvoicesProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [sortDateDirection, setSortDateDirection] = useState<string>("");
  const [sortPriceDirection, setSortPriceDirection] = useState<string>("");

  // Filter states
  const [validityStatus, setValidityStatus] = useState<string>("all");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      // If query is empty, reset the search & sort
      setInvoices(initialInvoices);
      setSortDateDirection("");
      setSortPriceDirection("");
    } else {
      // Filter the invoices based on the customer name or invoice ID
      const filteredInvoices = invoices.filter((invoice) => {
        const customer = customerMap[invoice.customer];
        const fullName = customer
          ? `${customer.firstName} ${customer.lastName}`.toLowerCase()
          : "unknown";

        return (
          fullName.includes(query.toLowerCase()) ||
          invoice.invoiceId.toString().includes(query.toLowerCase())
        );
      });

      setInvoices(filteredInvoices);
    }
  };

  // Sorting function
  const sortInvoices = (criteria: string, direction: "asc" | "desc") => {
    const sortedInvoices = [...invoices].sort((a, b) => {
      let valueA: number | string;
      let valueB: number | string;

      if (criteria === "dateIssued") {
        valueA = new Date(a.dateIssued).getTime();
        valueB = new Date(b.dateIssued).getTime();
      } else if (criteria === "totalAmount") {
        valueA = a.totalAmount;
        valueB = b.totalAmount;
      } else {
        return 0;
      }

      if (direction === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setInvoices(sortedInvoices);
    console.log("sortedInvoices", sortedInvoices);
  };

  // Filtering logic
  const handleFilter = () => {
    let filteredInvoices = initialInvoices;

    // Filter by validity status
    if (validityStatus !== "all") {
      filteredInvoices = filteredInvoices.filter(
        (invoice) => invoice.validityStatus === validityStatus,
      );
    }

    // Filter by payment status
    if (paymentStatus) {
      filteredInvoices = filteredInvoices.filter(
        (invoice) => invoice.paymentStatus === paymentStatus,
      );
    }

    // Filter by payment method
    if (paymentMethod) {
      filteredInvoices = filteredInvoices.filter(
        (invoice) =>
          invoice.payments[0]?.paymentMethod ===
          invoice.payments[0]?.paymentMethod,
      );
    }

    setInvoices(filteredInvoices);
  };

  // Handling validity status filter change
  const handleValidityStatusChange = (status: string) => {
    setValidityStatus(status);
    handleFilter();
  };

  // Handling payment status filter change
  const handlePaymentStatusChange = (status: string | null) => {
    setPaymentStatus(status);
    handleFilter();
  };

  // Handling payment method filter change
  const handlePaymentMethodChange = (method: string | null) => {
    setPaymentMethod(method);
    handleFilter();
  };

  const invoiceDisplay = (validityStatus?: string) => {
    if (validityStatus === "all") {
      return invoices.map((invoice) => {
        const customer = customerMap[invoice.customer];
        const fullName = customer
          ? `${customer.firstName} ${customer.lastName}`
          : "Unknown";

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
    }

    return invoices
      .filter((invoice) => invoice.validityStatus === validityStatus)
      .map((invoice) => {
        const customer = customerMap[invoice.customer];
        const fullName = customer
          ? `${customer.firstName} ${customer.lastName}`
          : "Unknown";

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
    if (validityStatus === "all") {
      return invoices.length;
    }

    return invoices.filter(
      (invoice) => invoice.validityStatus === validityStatus,
    ).length;
  };

  const cardDisplay = (validityStatus?: string) => {
    if (!invoices || invoices.length === 0) {
      return <div className="mt-4">No Invoices Found</div>;
    }

    return (
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            Manage Customer Invoices and Edit Details.
          </CardDescription>
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
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{invoiceDisplay(validityStatus)}</TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {invoiceCount(validityStatus) === 0 ? "0" : "1"}-
              {invoiceCount(validityStatus)}
            </strong>{" "}
            of <strong>{invoiceCount(validityStatus)}</strong> Invoices
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />

      {/* Sort selects */}
      <div className="flex items-center space-x-4 bg-secondary p-4 rounded">
        <span className="text-sm font-bold">Sort by</span>
        <Select
          value={sortDateDirection}
          onValueChange={(newDirection) => {
            setSortDateDirection(newDirection);
            setSortPriceDirection("");
            if (newDirection === "asc" || newDirection === "desc")
              sortInvoices("dateIssued", newDirection);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by Date</SelectLabel>
              <SelectItem value="asc">Date: Early to Late</SelectItem>
              <SelectItem value="desc">Date: Late to Early</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={sortPriceDirection}
          onValueChange={(newDirection) => {
            setSortPriceDirection(newDirection);
            setSortDateDirection("");
            if (newDirection === "asc" || newDirection === "desc")
              sortInvoices("totalAmount", newDirection);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Amount" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by Amount</SelectLabel>
              <SelectItem value="asc">Amount: Low to High</SelectItem>
              <SelectItem value="desc">Amount: High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {/* Validity Status Filter */}
      <div>
        <h4>Validity Status</h4>
        <select
          value={validityStatus}
          onChange={(e) => handleValidityStatusChange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="void">Void</option>
        </select>
      </div>

      {/* Payment Status Filter */}
      <div>
        <h4>Payment Status</h4>
        <label>
          <input
            type="radio"
            name="paymentStatus"
            value="paid"
            onChange={() => handlePaymentStatusChange("paid")}
          />
          Paid
        </label>
        <label>
          <input
            type="radio"
            name="paymentStatus"
            value="unpaid"
            onChange={() => handlePaymentStatusChange("unpaid")}
          />
          Unpaid
        </label>
        <label>
          <input
            type="radio"
            name="paymentStatus"
            value=""
            onChange={() => handlePaymentStatusChange(null)}
          />
          All
        </label>
      </div>

      {/* Payment Method Filter */}
      <div>
        <h4>Payment Method</h4>
        <select
          value={paymentMethod || ""}
          onChange={(e) => handlePaymentMethodChange(e.target.value || null)}
        >
          <option value="">All</option>
          <option value="cash">Cash</option>
          <option value="bankTransfer">Bank Transfer</option>
          <option value="paynow">PayNow</option>
          <option value="paylah">PayLah</option>
        </select>
      </div>

      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="void" className="hidden sm:flex">
              Void
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/staff/invoices/create-invoice">
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Create Invoices
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <TabsContent value="all">{cardDisplay("all")}</TabsContent>
        <TabsContent value="active">{cardDisplay("active")}</TabsContent>
        <TabsContent value="draft">{cardDisplay("draft")}</TabsContent>
        <TabsContent value="void">{cardDisplay("void")}</TabsContent>
      </Tabs>
    </>
  );
}
