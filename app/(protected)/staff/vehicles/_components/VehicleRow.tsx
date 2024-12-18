"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { deleteVehicle } from "@/lib/actions/vehicles";
import { useRouter } from "next/navigation";

export default function VehicleRow({
  id,
  licencePlate,
  gpsApi,
  make,
  model,
  status,
  createdAt,
}: {
  id: string;
  licencePlate: string;
  gpsApi: string;
  make: string;
  model: string;
  status: string;
  createdAt: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );
    if (confirmed) {
      try {
        await deleteVehicle(id);
        router.refresh();
      } catch (err) {
        window.alert(
          (err as Error).message ?? "An error has occurred, please try again."
        );
      }
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{licencePlate}</TableCell>
      <TableCell className="font-medium">{gpsApi}</TableCell>
      <TableCell className="font-medium">{make}</TableCell>
      <TableCell className="font-medium">{model}</TableCell>
      <TableCell>
        <Badge variant="outline">{status}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{createdAt}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-haspopup="true"
              size="icon"
              variant="ghost"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push(`/staff/vehicles/edit-vehicle/${id}`)}
              className="cursor-pointer"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
