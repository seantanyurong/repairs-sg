"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const QuoteActionsClient = ({
  status,
  sendEmailAction,
  updateStatusAction,
}: {
  status: string;
  sendEmailAction: () => Promise<void>;
  updateStatusAction: (newStatus: string) => Promise<unknown>;
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
      await updateStatusAction(newStatus);
      toast.success("Status updated successfully");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error updating status");
    } finally {
      setIsLoading(false);
    }
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
          <Button
            type="button"
            onClick={() => updateStatus("Declined")}
            variant="destructive"
            className="w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>Decline Quote</>
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default QuoteActionsClient;
