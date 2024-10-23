"use client";
import Image from "next/image";
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
import { useRouter } from "next/navigation";
import ChangePasswordForm from "./ChangePasswordForm";
import StaffDetails from "./StaffDetails";
import { deleteStaff } from "@/lib/actions/staff";
import { useUser } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";

export default function StaffRow({
  id,
  imageUrl,
  firstName,
  lastName,
  email,
  role,
  phone,
}: {
  id: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
}) {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this staff?"
    );
    if (confirmed) {
      await deleteStaff(id);
      router.refresh();
    }
  };

  const roleOrder: Record<string, number> = {
    superadmin: 3,
    admin: 2,
    technician: 1,
  };

  const disableEdit =
    roleOrder[user.publicMetadata.role as string] < roleOrder[role as string];
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
        <Badge variant="outline">{role.toUpperCase()}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{phone}</TableCell>
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
                <StaffDetails
                  id={id}
                  imageUrl={imageUrl}
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  role={role as string}
                  phone={phone as string}
                  // status={status as string}
                  disableEdit={disableEdit}
                />
                {!disableEdit && <ChangePasswordForm id={id} />}
              </div>
              <Separator className="m-1 ml-[-1px]" />
              {!disableEdit && (
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/staff/staff-management/edit-staff/${id}`)
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
