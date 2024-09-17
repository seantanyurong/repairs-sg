"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { setQuoteTemplateInactive } from "@/lib/actions/quoteTemplates";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

type QuoteTemplate = {
  _id: string;
  name: string;
  status: "Active" | "Inactive";
  createdAt: string;
};

const deleteQuoteTemplate = async (id: string) => {
  await setQuoteTemplateInactive(id);
};

export const columns: ColumnDef<QuoteTemplate>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.original.status == "Active" ? "default" : "destructive"}
        >
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Link href={`/staff/quote/templates/edit/${row.original._id}`}>
            <Button variant="ghost">Edit</Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => deleteQuoteTemplate(row.original._id)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
