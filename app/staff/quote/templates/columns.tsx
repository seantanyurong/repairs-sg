"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Template } from "@pdfme/common";

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
];
