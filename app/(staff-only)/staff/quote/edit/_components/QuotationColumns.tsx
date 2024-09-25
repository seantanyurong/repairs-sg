"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { setQuotationInactive } from "@/lib/actions/quotations";
import { setQuoteTemplateInactive } from "@/lib/actions/quoteTemplates";
import { ColumnDef, Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Quotation = {
  _id: string;

  name: string;
  status: "Active" | "Inactive";
  createdAt: string;
};

const deleteQuotation = async (id: string, router: AppRouterInstance) => {
  try {
    const result = await setQuotationInactive(id);
    toast.success(result.message);
    router.refresh();
  } catch (err) {
    toast.error("An error has occurred, please try again.");
  }
};

export const quotationColumns: ColumnDef<Quotation>[] = [
  {
    accessorKey: "name",
    header: "Number",
  },
  {
    accessorKey: "name",
    header: "Customer",
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
    accessorKey: "totalAmount",
    header: "Total",
  },
  {
    id: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return dayjs(row.original.createdAt).format("DD-MMM-YYYY HH:mm ");
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      if (row.original.status === "Active") return <ActionColumn row={row} />;
    },
  },
];

function ActionColumn({ row }: { row: Row<Quotation> }) {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <Link href={`/staff/quote/edit/${row.original._id}`}>
        <Button variant="ghost">Edit</Button>
      </Link>
      <Button
        variant="destructive"
        onClick={() => deleteQuotation(row.original._id, router)}
      >
        Deactivate
      </Button>
    </div>
  );
}
