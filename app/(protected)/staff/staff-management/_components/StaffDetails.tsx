"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { CustomMenuButton } from "@/components/ui/customMenuButton";

export default function StaffDetails({
  id,
  imageUrl,
  firstName,
  lastName,
  email,
  role,
  phone,
  disableEdit,
}: {
  id: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  disableEdit: boolean;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <CustomMenuButton variant="ghost">View Details</CustomMenuButton>
      </SheetTrigger>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle>Profile Details</SheetTitle>
          <SheetDescription>
            View details of staff profile. Click edit to be redirected to edit
            staff page.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-9 py-9">
          <div className="flex justify-center">
            <Image
              alt="Profile image"
              className="rounded-full object-cover"
              height="64"
              src={imageUrl}
              width="64"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              First Name
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {firstName || "-"}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Last Name
            </Label>
            <p className="text-sm text-muted-foreground">{lastName || "-"}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Email
            </Label>
            <p className="text-sm text-muted-foreground col-span-3 break-words">{email || "-"}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Role
            </Label>
            <p className="text-sm text-muted-foreground">{role || "-"}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <p className="text-sm text-muted-foreground">{phone || "-"}</p>
          </div>
          {!disableEdit && (
            <SheetFooter>
              <Button>
                <Link href={`/staff/staff-management/edit-staff/${id}`}>
                  Edit
                </Link>
              </Button>
            </SheetFooter>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
