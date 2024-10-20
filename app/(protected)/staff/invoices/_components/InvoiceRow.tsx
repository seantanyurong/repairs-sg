"use client";

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
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function InvoiceRow({
  _id,
  invoiceId,
  dateIssued,
  totalAmount,
  lineItems,
  paymentStatus,
  paymentMethod,
  customer,
}: {
  _id: string;
  invoiceId: string;
  dateIssued: string;
  totalAmount: string;
  lineItems: Array<string>;
  paymentStatus: string;
  validityStatus: string;
  paymentMethod: string;
  customer: string;
}) {
  const router = useRouter();

  // Format Date
  const formattedDateIssued = dayjs(dateIssued).format("DD/MM/YYYY");

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [voidReason, setVoidReason] = useState<string>("");
  const { toast } = useToast();
  const handleVoidAction = () => {
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const handleVoidInvoice = async () => {
    await voidInvoice({
      _id: _id,
      validityStatus: "void",
      voidReason: voidReason,
      lastUpdatedBy: "gmail",
    });

    handleCloseDialog();
    router.refresh();

    // TODO: link to view invoice
    toast({
      title: "Void Successfully!",
      action: (
        <ToastAction altText="Go to voided invoice">View Invoice</ToastAction>
      ),
    });
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{invoiceId.toString()}</TableCell>
        <TableCell className="font-medium">
          {formattedDateIssued.toString()}
        </TableCell>
        <TableCell className="font-medium">{customer}</TableCell>
        <TableCell className="font-medium">${totalAmount.toString()}</TableCell>
        <TableCell className="font-medium">
          {lineItems.length.toString()} Items
        </TableCell>
        <TableCell className="font-medium">{paymentStatus}</TableCell>
        <TableCell className="font-medium">{paymentMethod}</TableCell>
        <TableCell>
          <DropdownMenu>
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
                  router.push(`/staff/invoices/edit-invoice/${_id}`)
                }
                className="cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleVoidAction}
                className="cursor-pointer"
              >
                Void
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently void the
              customer's invoice.
            </DialogDescription>
          </DialogHeader>
          <Label>Void Reason</Label>
          <Input
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
    </>
  );
}
