"use client";

import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

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

type ValidityStatus = "active" | "draft" | "void";
type PaymentStatus = "paid" | "unpaid";
type PaymentMethod = "cash" | "banktransfer" | "paynow";

export default function Invoices({
  initialInvoices,
  customerMap,
}: InvoicesProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [filteredInvoices, setFilteredInvoices] =
    useState<Invoice[]>(initialInvoices);
  const [query, setQuery] = useState<string>("");

  // Sort states
  const [sortDateDirection, setSortDateDirection] = useState<string>("");
  const [sortPriceDirection, setSortPriceDirection] = useState<string>("");

  // Filter states
  const [validityStatus, setValidityStatus] = useState<{
    active: boolean;
    draft: boolean;
    void: boolean;
  }>({
    active: true,
    draft: true,
    void: true,
  });
  const [paymentStatus, setPaymentStatus] = useState<{
    paid: boolean;
    unpaid: boolean;
  }>({
    paid: true,
    unpaid: true,
  });

  const [paymentMethod, setPaymentMethod] = useState({
    cash: true,
    banktransfer: true,
    paynow: true,
  });

  const handleSearch = (query: string) => {
    setQuery(query);
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
      console.log("search", filteredInvoices);
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
  const handleValidityChange = (filter: string, checked: boolean) => {
    setValidityStatus((prevState) => ({
      ...prevState,
      [filter]: checked,
    }));
  };

  const handlePaymentStatusChange = (filter: string, checked: boolean) => {
    setPaymentStatus((prevState) => ({
      ...prevState,
      [filter]: checked,
    }));
  };

  const handlePaymentMethodChange = (filter: string, checked: boolean) => {
    setPaymentMethod((prevState) => ({
      ...prevState,
      [filter]: checked,
    }));
  };

  useEffect(() => {
    handleFilter();
  }, [validityStatus, paymentStatus, paymentMethod]);

  const handleFilter = () => {
    handleSearch(query);

    // Filter by validity status
    let filteredInvoices = initialInvoices.filter((invoice) => {
      const validityKey = invoice.validityStatus as ValidityStatus;
      return validityStatus[validityKey];
    });

    // Filter by payment status
    filteredInvoices = filteredInvoices.filter((invoice) => {
      const paymentStatusKey =
        invoice.paymentStatus.toLowerCase() as PaymentStatus;
      return paymentStatus[paymentStatusKey];
    });

    // Filter by payment method
    filteredInvoices = filteredInvoices.filter((invoice) => {
      if (invoice.payments[0]) {
        const paymentMethodKey =
          invoice.payments[0].paymentMethod.toLowerCase() as PaymentMethod;
        console.log(
          "paymentMethodKey",
          paymentMethodKey,
          paymentMethod[paymentMethodKey],
        );
        return paymentMethod[paymentMethodKey];
      }
    });

    setInvoices(filteredInvoices);
    console.log("filter", filteredInvoices);
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

      <div className="p-4 border rounded">
        <h2 className="text-lg font-bold mb-4">Search Filter</h2>

        {/* Validity Status */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold">Validity Status</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="validityActive"
                defaultChecked={true}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean")
                    handleValidityChange("active", checked);
                }}
              />
              <label
                htmlFor="validityActive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="validityDraft"
                defaultChecked={true}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean")
                    handleValidityChange("draft", checked);
                }}
              />
              <label
                htmlFor="validityDraft"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Draft
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="validityVoid"
                defaultChecked={true}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean")
                    handleValidityChange("void", checked);
                }}
              />
              <label
                htmlFor="validityVoid"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Void
              </label>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold">Payment Status</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="paymentPaid"
                defaultChecked={true}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean")
                    handlePaymentStatusChange("paid", checked);
                }}
              />
              <label
                htmlFor="paymentPaid"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Paid
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="paymentUnpaid"
                defaultChecked={true}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean")
                    handlePaymentStatusChange("unpaid", checked);
                }}
              />
              <label
                htmlFor="paymentUnpaid"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Unpaid
              </label>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold">Payment Method</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="paymentCash"
                defaultChecked={true}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean")
                    handlePaymentMethodChange("cash", checked);
                }}
              />
              <label
                htmlFor="paymentCash"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Cash
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="paymentBankTransfer"
                defaultChecked={true}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean")
                    handlePaymentMethodChange("banktransfer", checked);
                }}
              />
              <label
                htmlFor="paymentBankTransfer"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Bank Transfer
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="paymentPayNow"
                defaultChecked={true}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean")
                    handlePaymentMethodChange("paynow", checked);
                }}
              />
              <label
                htmlFor="paymentPayNow"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                PayNow
              </label>
            </div>
          </div>
        </div>
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
