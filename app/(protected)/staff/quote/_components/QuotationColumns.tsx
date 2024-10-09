"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";

type Quotation = {
  _id: string;
  quotationId: number;
  name: string;
  status: "Active" | "Inactive";
  createdAt: string;
};

// const deleteQuotation = async (id: string, router: AppRouterInstance) => {
//   try {
//     const result = await setQuotationInactive(id);
//     toast.success(result.message);
//     router.refresh();
//   } catch {
//     toast.error("An error has occurred, please try again.");
//   }
// };

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
      return <ActionColumn row={row} />;
    },
  },
];

function ActionColumn({ row }: { row: Row<Quotation> }) {
  // const router = useRouter();

  return (
    <div className="flex gap-2">
      <Link href={`/staff/quote/edit/${row.original._id}`}>
        <Button variant="ghost">Edit</Button>
      </Link>
      <Button
        variant="destructive"
        // onClick={() => deleteQuotation(row.original._id, router)}
      >
        Deactivate
      </Button>
    </div>
  );
}
