import React from "react";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { User } from "@clerk/backend";
import { getLeave } from "@/lib/actions/leave";
import EditLeaveClient from "./clientPage";

const roleOrder: Record<string, number> = {
  superadmin: 3,
  admin: 2,
  technician: 1,
};

export default async function EditLeave({
  params,
}: {
  params: { leaveId: string };
}) {
  const leave = await getLeave(params.leaveId);
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;
  const user = await clerkClient().users.getUser(userId as string);
  const staffUsers = await clerkClient().users.getUserList();
  const authorisedStaffUsers = staffUsers.data.filter(
    (staff) =>
      roleOrder[user.publicMetadata.role as string] <
      roleOrder[staff.publicMetadata.role as string]
  );
  return (
    <EditLeaveClient
      approvers={JSON.parse(JSON.stringify(authorisedStaffUsers as User[]))}
      leave={{
        _id: leave._id,
        type: leave.type,
        status: leave.status,
        dateRange: {
          start: leave.dateRange?.start,
          end: leave.dateRange?.end,
        },
        requesterId: leave.requesterId,
        approverId: leave.approverId,
      }}
    />
  );
}
