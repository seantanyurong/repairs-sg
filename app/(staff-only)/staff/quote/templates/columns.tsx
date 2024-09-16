"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Template } from "@pdfme/common";
import { Button } from "@/components/ui/button";

export type QuoteTemplate = {
  id: string;
  name: string;
  status: "active" | "inactive";
  pdfTemplate: Template;
};

export const columns: ColumnDef<QuoteTemplate>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => console.log(row)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => console.log(row)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
