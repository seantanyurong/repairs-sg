"use client";

import { useUser } from "@clerk/clerk-react";
import { Template } from "@pdfme/common";
import { Viewer } from "@pdfme/ui";
import { useEffect, useRef, useState } from "react";
import { font, plugins } from "../../_components/SchemaPDF";
import { Button } from "@/components/ui/button";
import { generate } from "@pdfme/generator";
import { FileDown, FilePenLineIcon, FileX2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { voidInvoice } from "@/lib/actions/invoices";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const InvoiceViewerClient = ({
  template,
  inputs,
}: {
  template: Template;
  inputs: Record<string, unknown>[];
}) => {
  const uiRef = useRef<HTMLDivElement | null>(null);
  const ui = useRef<Viewer | null>(null);
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const isVoid = inputs[0].validity_status === "void";
  const invoiceId = inputs[0].invoiceId?.toString() as string;

  // Void Invoice
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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please input a void reason.",
      });
      return;
    }

    try {
      console.log("start to void");
      const res = await voidInvoice({
        invoiceId: invoiceId,
        validityStatus: "void",
        voidReason: voidReason,
        lastUpdatedBy: user?.id || "",
      });

      console.log("res", res);

      handleCloseDialog();

      toast({
        title: "Invoice Void Successfully",
        action: (
          <ToastAction
            altText="Go to voided invoice"
            onClick={() =>
              router.push(`/staff/invoices/view-invoice/${invoiceId}`)
            }
            className="cursor-pointer"
          >
            View Invoice
          </ToastAction>
        ),
      });

      router.refresh();
    } catch (error) {
      console.error("Error voiding invoice:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while voiding the invoice.",
      });
    }
  };

  useEffect(() => {
    const buildUi = () => {
      if (typeof window !== "undefined" && uiRef.current) {
        ui.current = new Viewer({
          domContainer: uiRef.current,
          template,
          inputs,
          options: {
            font,
          },
          plugins,
        });
      }
    };
    buildUi();
  }, [inputs, template]);

  const generatePDF = async () => {
    try {
      const pdf = await generate({
        template,
        inputs,
        options: { font },
        plugins,
      });

      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob));
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Error generating PDF, please refresh the page and try again",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 lg:w-1/2 w-full h-screen">
      <div className="flex gap-2 mb-4 justify-between">
        <Button type="button" onClick={() => generatePDF()} disabled={isVoid}>
          <FileDown className="mr-2 h-4 w-4" />
          Download PDF
        </Button>

        <Button
          type="button"
          onClick={() =>
            router.push(`/staff/invoices/edit-invoice/${invoiceId}`)
          }
          disabled={isVoid}
        >
          <FilePenLineIcon className="mr-2 h-4 w-4" />
          Edit Invoice
        </Button>

        <Button type="button" onClick={handleVoidAction} disabled={isVoid}>
          <FileX2Icon className="mr-2 h-4 w-4" />
          Void Invoice
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
      <div ref={uiRef} />
    </div>
  );
};

export default InvoiceViewerClient;
