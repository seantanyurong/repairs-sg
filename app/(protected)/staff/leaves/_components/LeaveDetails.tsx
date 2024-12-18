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
import { User } from "@clerk/backend";
import { formatShortDate } from "./LeaveRow";
import { OctagonAlert } from "lucide-react";
import { CustomMenuButton } from "@/components/ui/customMenuButton";

export default function LeaveDetails({
  _id,
  type,
  status,
  start,
  end,
  actor,
  actorRole,
  createdAt,
  disableEdit,
  clash,
}: {
  _id: string;
  type: string;
  status: string;
  start: Date;
  end: Date;
  actor: User;
  actorRole: string;
  createdAt: string;
  disableEdit: boolean;
  clash: boolean;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <CustomMenuButton className="w-[110%]" variant="ghost">View Details</CustomMenuButton>
      </SheetTrigger>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle className="flex gap-2">
            Leave Request Details {clash && <OctagonAlert color="red" />}
          </SheetTitle>
          {actorRole === "approver" ? (
            status === "PENDING" ? (
              <SheetDescription>
                {clash && (
                  <p className="text-sm text-red-400 italic mb-2">
                    Clashing leave and scheduled job! Please inform admin to
                    reassign job to other technician!
                  </p>
                )}
                View details of leave request. Click edit to be redirected to
                edit leave request page.
              </SheetDescription>
            ) : (
              <SheetDescription>
                View details of leave request. Unable to edit, leave has been{" "}
                {`${status.toLowerCase()}`}.
              </SheetDescription>
            )
          ) : (
            <SheetDescription>
              {clash && (
                <p className="text-sm text-red-400 italic mb-2">
                  Clashing leave and scheduled job! Please reassign job to other
                  technicians before approving!
                </p>
              )}
              View details of leave request.
            </SheetDescription>
          )}
        </SheetHeader>
        <div className="grid gap-9 py-9">
          <div className="flex justify-center">
            <Image
              alt="Profile image"
              className="rounded-full object-cover"
              height="64"
              src={actor.imageUrl}
              width="64"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              {actorRole === "approver" ? "Approver" : "Requester"}
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {actor.firstName + " " + actor.lastName || "-"}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Start Date
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {formatShortDate(start.toISOString()) || "-"}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              End Date
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {formatShortDate(end.toISOString()) || "-"}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Type
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {type === "ANNUAL" ? "Annual" : type || "-"}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Status
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {status.charAt(0) + status.slice(1).toLowerCase() || "-"}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Created At
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {formatShortDate(createdAt) || "-"}
            </p>
          </div>
          {!disableEdit && actorRole === "approver" && (
            <SheetFooter>
              <Button>
                <Link href={`/staff/leaves/edit-leave/${_id}`}>Edit</Link>
              </Button>
            </SheetFooter>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
