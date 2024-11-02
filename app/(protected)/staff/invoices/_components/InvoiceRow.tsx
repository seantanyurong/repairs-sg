"use client";

import { useUser } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { voidInvoice } from "@/lib/actions/invoices";
import { toast } from "sonner";

export default function InvoiceRow({
  invoiceId,
  dateIssued,
  totalAmount,
  lineItems,
  validityStatus,
  paymentStatus,
  paymentMethod,
  customer,
  job,
}: {
  invoiceId: string;
  dateIssued: string;
  totalAmount: string;
  lineItems: Array<string>;
  paymentStatus: string;
  validityStatus: string;
  paymentMethod: string;
  customer: string;
  job: string;
}) {
  const router = useRouter();
  const { user } = useUser();

  // Format Date
  const formattedDateIssued = dayjs(dateIssued).format("DD/MM/YYYY");

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [voidReason, setVoidReason] = useState<string>("");
  const handleVoidAction = () => {
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const handleVoidInvoice = async () => {
    if (!voidReason.trim()) {
      toast.error("Please input a void reason.");
      return;
    }
    try {
      await voidInvoice({
        invoiceId: invoiceId,
        validityStatus: "void",
        voidReason: voidReason,
        lastUpdatedBy: user?.id || "",
      });

      handleCloseDialog();

      toast("Invoice Void Successfully", {
        className: "cursor-pointer",
        action: {
          label: "View Invoice",
          onClick: () =>
            router.push(`/staff/invoices/view-invoice/${invoiceId}`),
        },
      });
    } catch (error) {
      console.error("Error voiding invoice:", error);
      toast.error("An error occurred while voiding the invoice.");
    }
  };

  const isVoid = validityStatus === "void";

  return (
    <>
      <TableRow>
        <TableCell className={isVoid ? "opacity-50 cursor-not-allowed" : ""}>
          {invoiceId.toString()}
        </TableCell>
        <TableCell className={isVoid ? "opacity-50 cursor-not-allowed" : ""}>
          {formattedDateIssued.toString()}
        </TableCell>
        <TableCell className={isVoid ? "opacity-50 cursor-not-allowed" : ""}>
          {customer}
        </TableCell>
        <TableCell className={isVoid ? "opacity-50 cursor-not-allowed" : ""}>
          {job}
        </TableCell>
        <TableCell className={isVoid ? "opacity-50 cursor-not-allowed" : ""}>
          ${totalAmount.toString()}
        </TableCell>
        <TableCell className={isVoid ? "opacity-50 cursor-not-allowed" : ""}>
          {lineItems.length.toString()} Items
        </TableCell>
        <TableCell className={isVoid ? "opacity-50 cursor-not-allowed" : ""}>
          {validityStatus.charAt(0).toUpperCase() + validityStatus.slice(1)}
        </TableCell>
        <TableCell className={isVoid ? "opacity-50 cursor-not-allowed" : ""}>
          {paymentStatus}
        </TableCell>
        <TableCell className={isVoid ? "opacity-50 cursor-not-allowed" : ""}>
          {paymentMethod}
        </TableCell>
        <TableCell>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/staff/invoices/view-invoice/${invoiceId}`)
                  }
                  className="cursor-pointer"
                >
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isVoid}
                  onClick={() =>
                    router.push(`/staff/invoices/edit-invoice/${invoiceId}`)
                  }
                  className="cursor-pointer"
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isVoid}
                  onClick={handleVoidAction}
                  className="cursor-pointer"
                >
                  Void
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently void the
                  customer&apos;s invoice.
                </DialogDescription>
              </DialogHeader>
              <Label>Void Reason</Label>
              <Input
                required={true}
                value={voidReason}
                placeholder="Enter void reason..."
                onChange={(e) => setVoidReason(e.target.value)}
              />
              <div className="flex justify-end">
                <Button variant="destructive" onClick={handleVoidInvoice}>
                  Void Invoice
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TableCell>
      </TableRow>
    </>
  );
}
