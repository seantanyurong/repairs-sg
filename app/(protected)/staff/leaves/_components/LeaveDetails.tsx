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
// import { CustomMenuButton } from "@/components/ui/customMenuButton";

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
}: {
  _id: string;
  type: string;
  status: string;
  start: string;
  end: string;
  actor: User;
  actorRole: string;
  createdAt: string;
  disableEdit: boolean;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">View Details</Button>
      </SheetTrigger>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle>Leave Request Details</SheetTitle>
          {actorRole === "approver" ? (
            status === "PENDING" ? (
              <SheetDescription>
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
            <SheetDescription>View details of leave request.</SheetDescription>
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
              {formatShortDate(start) || "-"}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              End Date
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {formatShortDate(end) || "-"}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Type
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {type || "-"}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Status
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {status || "-"}
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
