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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const quotationDeclineReasons = [
  "Too Expensive",
  "Found a Better Offer",
  "Not Interested Anymore",
  "Project Postponed",
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
  const [open, setOpen] = useState(false);
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

  const declineFormSchema = z.object({
    declineReason: z.string(),
    declineDetails: z.string().optional(),
  });

  const declineForm = useForm<z.infer<typeof declineFormSchema>>({
    resolver: zodResolver(declineFormSchema),
  });

  const onSubmit = async () => {
    try {
      await updateQuotationAction("Declined", declineForm.getValues());
      setOpen(false);
      router.refresh();
      toast.success("Quote Declined Successfully");
    } catch (err) {
      console.error(err);
      toast.error("An error has occurred, please try again.");
    }
  };

  const DeclineQuoteDialog = () => {
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger>
          <Button variant="destructive">Decline Quote</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Decline Quote</DialogTitle>
            <DialogDescription>
              Please provide a reason for declining the quotation
            </DialogDescription>
          </DialogHeader>
          <Form {...declineForm}>
            <form
              className="grid gap-4 py-4"
              onSubmit={(e) => {
                e.preventDefault();
                declineForm.handleSubmit(onSubmit)();
              }}
            >
              <FormField
                control={declineForm.control}
                name="declineReason"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Reason for Declining Quote</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={declineForm.control}
                name="declineDetails"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="More details"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <DialogFooter>
                <Button type="submit">Decline Quote</Button>
              </DialogFooter>
            </form>
          </Form>
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
    </div>
  );
};

export default QuoteActionsClient;
