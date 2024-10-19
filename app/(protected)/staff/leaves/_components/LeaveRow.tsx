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
import { MoreHorizontal, OctagonAlert } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { deleteLeave, updateLeave } from "@/lib/actions/leave";
import { User } from "@clerk/backend";
import LeaveDetails from "./LeaveDetails";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  // Define an array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export default function LeaveRow({
  _id,
  type,
  status,
  start,
  end,
  actor,
  actorRole,
  userId,
  createdAt,
  clash,
}: {
  _id: string;
  type: string;
  status: string;
  start: string;
  end: string;
  actor: User;
  actorRole: string;
  userId: string;
  createdAt: string;
  clash: boolean;
}) {
  const router = useRouter();

  const handleAction = async (action: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this leave request?`
    );
    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";
    if (confirmed) {
      await updateLeave({
        _id: _id,
        type: type,
        status: newStatus,
        dateRange: {
          start: start.toString(),
          end: end.toString(),
        },
        requesterId: actor.id,
        approverId: userId,
      });
      toast(`Leave has been ${action}ed`);
      router.refresh();
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this leave request?"
    );
    if (confirmed) {
      await deleteLeave(_id);
      router.refresh();
    }
  };

  return (
    <TableRow>
      <TableCell className="hidden md:table-cell">
        <Image
          alt="Product image"
          className="rounded-full object-cover"
          height="50"
          src={actor.imageUrl}
          width="50"
        />
      </TableCell>
      <TableCell className="font-medium">
        {actor?.firstName + " " + actor?.lastName}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge variant="outline">{type}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatShortDate(start)}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatShortDate(end)}
      </TableCell>
      <TableCell>
        <Badge variant="outline">{status}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatShortDate(createdAt)}
      </TableCell>

      <TableCell>
        {clash ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <OctagonAlert color="red" />
            </TooltipTrigger>
            <TooltipContent className="text-wrap">
              {actorRole === "requester" &&
                "Clashing leave and scheduled job! Please reassign job to other technicians before approving!"}
              {actorRole === "approver" &&
                "Clashing leave and scheduled job! Please inform admin to reassign job to other technician!"}
            </TooltipContent>
          </Tooltip>
        ) : (
          ""
        )}
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <LeaveDetails
              _id={_id}
              type={type}
              status={status}
              start={start}
              end={end}
              actor={actor}
              actorRole={actorRole}
              createdAt={createdAt}
              disableEdit={status !== "PENDING"}
              clash={clash}
            />
            <Separator />
            {actorRole === "approver" && (
              <>
                <DropdownMenuItem
                  onClick={() => router.push(`/staff/leaves/edit-leave/${_id}`)}
                  className="cursor-pointer"
                  disabled={status !== "PENDING"}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="cursor-pointer"
                >
                  Delete
                </DropdownMenuItem>
              </>
            )}

            {actorRole === "requester" && status == "PENDING" && (
              <>
                <DropdownMenuItem
                  onClick={() => handleAction("approve")}
                  className="cursor-pointer"
                  disabled={clash}
                >
                  Approve
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleAction("reject")}
                  className="cursor-pointer"
                >
                  Reject
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
