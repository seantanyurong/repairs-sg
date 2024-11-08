"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const quotationDeclineReasons = [
  "Too Expensive",
  "Found a Better Offer",
  "Budget Constraints",
  "Scheduling Conflicts",
  "Slow Responsiveness",
  "Others",
];

const QuoteActionsClient = ({
  quotationId,
  status,
  sendEmailAction,
  updateQuotationAction,
}: {
  quotationId: string;
  status: string;
  sendEmailAction: () => Promise<void>;
  updateQuotationAction: (
    newStatus: string,
    declineReasons?: {
      declineReason: string;
      declineDetails?: string;
    }
  ) => Promise<unknown>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const router = useRouter();

  const sendQuoteEmail = async () => {
    try {
      setIsSendingEmail(true);
      await sendEmailAction();
      toast.success("Email sent successfully");
    } catch (e) {
      console.error(e);
      toast.error("Error sending email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      setIsLoading(true);
      await updateQuotationAction(newStatus);
      toast.success("Status updated successfully");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error updating status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const declineReason = formData.get("declineReason")?.toString() ?? "";
    const declineDetails = formData.get("declineDetails")?.toString() ?? "";
    try {
      await updateQuotationAction("Declined", {
        declineReason,
        declineDetails,
      });

      router.refresh();
      toast.success("Quote Declined Successfully");
    } catch (err) {
      console.error(err);
      toast.error("An error has occurred, please try again.");
    }
  };

  const DeclineQuoteDialog = () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">Decline Quote</Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Decline Quote</DialogTitle>
            <DialogDescription>
              Please provide a reason for declining the quotation
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleFormSubmit}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="declineReason">
                Reason for Declining Quotation
              </Label>
              <Select
                name="declineReason"
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {quotationDeclineReasons.map(
                    (reason: string, index: number) => (
                      <SelectItem
                        key={index}
                        value={reason}
                      >
                        {reason}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="declineDetails">Details</Label>
              <Textarea
                name="declineDetails"
                placeholder="More details"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Decline Quote</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="flex flex-row gap-2">
      {status !== "Draft" && status !== "Active" && (
        <Badge variant="secondary">{status}</Badge>
      )}
      {status === "Draft" && (
        <>
          <Badge variant="outline">Draft</Badge>
          <Button
            type="button"
            onClick={() => router.push(`/staff/quote/edit/${quotationId}`)}
            className="w-auto"
            variant="outline"
          >
            Edit
          </Button>
          <Button
            type="button"
            onClick={() => updateStatus("Active")}
            className="w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>Mark Active</>
            )}
          </Button>
        </>
      )}
      {status === "Active" && (
        <>
          <Badge>Active</Badge>
          <Button
            className="self-center ml-auto"
            disabled={isLoading}
            type="button"
            onClick={() => sendQuoteEmail()}
            variant="secondary"
          >
            {isSendingEmail ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>Send Quote via Email</>
            )}
          </Button>

          <Button
            type="button"
            onClick={() => updateStatus("Accepted")}
            className="w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>Accept Quote</>
            )}
          </Button>
          <DeclineQuoteDialog />
        </>
      )}
      {status === "Accepted" && (
        <Button
          type="button"
          onClick={() =>
            router.push(`/staff/schedule/create-job/${quotationId}`)
          }
          className="w-auto"
        >
          Create Job
        </Button>
      )}
    </div>
  );
};

export default QuoteActionsClient;
