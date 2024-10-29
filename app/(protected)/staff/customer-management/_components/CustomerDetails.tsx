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

export default function CustomerDetails({
  id,
  imageUrl,
  firstName,
  lastName,
  email,
  disableEdit,
  status,
}: {
  id: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  disableEdit: boolean;
  status: string;
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
            View details of customer profile. Click edit to be redirected to edit
            customer page.
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
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <p className="text-sm text-muted-foreground col-span-3 break-words">{status || "-"}</p>
          </div>
          {!disableEdit && (
            <SheetFooter>
              <Button>
                <Link href={`/customer/customer-management/edit-customer/${id}`}>
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
