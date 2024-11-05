"use client";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
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
import { useRouter } from "next/navigation";
import { deleteCustomer } from "@/lib/actions/customers";
import { useUser } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";

export default function CustomerRow({
  id,
  imageUrl,
  firstName,
  lastName,
  email,
  status,
}: {
  id: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}) {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (confirmed) {
      await deleteCustomer(id);
      router.refresh();
    }
  };

  const roleOrder: Record<string, number> = {
    superadmin: 3,
    admin: 2,
    technician: 1,
  };

  const disableEdit =
    roleOrder[user.publicMetadata.role as string] < 2
  const disableAction = user.id === id;

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Profile image"
          className="rounded-full object-cover"
          height="50"
          src={imageUrl}
          width="50"
        />
      </TableCell>
      <TableCell className="font-medium">
        {firstName + " " + lastName}
      </TableCell>

      <TableCell className="hidden md:table-cell font-medium">
        {email}
      </TableCell>
      <TableCell>
        <Badge variant="outline">{status.toUpperCase()}</Badge>
      </TableCell>
      <TableCell>
        {!disableAction && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <div className=" flex flex-col">
              <DropdownMenuItem
                  onClick={() =>
                    router.push(`/staff/customer-management/customer-details/${id}`)
                  }
                  className="cursor-pointer"
                >
                  View Details
                </DropdownMenuItem>
              </div>
              <Separator className="m-1 ml-[-1px]" />
              {!disableEdit && (
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/staff/customer-management/edit-customer/${id}`)
                  }
                  className="cursor-pointer"
                >
                  Edit
                </DropdownMenuItem>
              )}

              {!disableEdit && (
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="cursor-pointer"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
}
