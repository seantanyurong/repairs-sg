"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteQuotation } from "@/lib/actions/quotations";
import { ColumnDef, Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Quotation = {
  _id: string;
  quotationId: number;
  name: string;
  status: "Draft" | "Sent" | "Accepted" | "Declined" | "Expired";
  createdAt: string;
  totalAmount: number;
};

const handleDelete = async (id: string, router: AppRouterInstance) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this quotation?"
  );
  if (confirmed)
    try {
      const result = await deleteQuotation(id);
      toast.success(result.message);
      router.refresh();
    } catch {
      toast.error("An error has occurred, please try again.");
    }
};

const currencyFormat = new Intl.NumberFormat("en-SG", {
  style: "currency",
  currency: "SGD",
});

export const quotationColumns: ColumnDef<Quotation>[] = [
  {
    accessorKey: "quotationId",
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
      return <Badge variant="outline">{row.original.status}</Badge>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      return row.original.totalAmount
        ? currencyFormat.format(row.original.totalAmount)
        : "-";
    },
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
      return <ActionColumn row={row} />;
    },
  },
];

function ActionColumn({ row }: { row: Row<Quotation> }) {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      {row.original.status === "Draft" ? (
        <>
          <Link href={`/staff/quote/edit/${row.original._id}`}>
            <Button variant="ghost">Edit</Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => handleDelete(row.original._id, router)}
          >
            Delete
          </Button>
        </>
      ) : (
        <Link href={`/staff/quote/edit/${row.original._id}`}>
          <Button variant="ghost">View</Button>
        </Link>
      )}
    </div>
  );
}
