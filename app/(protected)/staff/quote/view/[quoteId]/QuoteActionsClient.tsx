"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";

const QuoteActionsClient = ({ status }: { status: string }) => {
  return (
    <div className="flex flex-row gap-2">
      <Badge variant={status === "Draft" ? "outline" : "default"}>
        {status}
      </Badge>
      {status === "Sent" && (
        <>
          <Button
            type="button"
            onClick={() => console.log("accept quote")}
            className="w-auto"
          >
            Accept Quote
          </Button>
          <Button
            type="button"
            onClick={() => console.log("send email")}
            variant="destructive"
            className="w-auto"
          >
            Decline Quote
          </Button>
        </>
      )}
      <Button
        type="button"
        onClick={() => console.log("send email")}
        variant="outline"
        className="w-auto"
      >
        Send Quote via Email
      </Button>
    </div>
  );
};

export default QuoteActionsClient;
