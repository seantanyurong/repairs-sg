import React from "react";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { User } from "@clerk/backend";
import CreateLeaveClient from "./clientPage";

const roleOrder: Record<string, number> = {
  superadmin: 3,
  admin: 2,
  technician: 1,
};

export default async function CreateLeave() {
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
    <CreateLeaveClient
      approvers={JSON.parse(JSON.stringify(authorisedStaffUsers as User[]))}
      userId={userId as string}
    />
  );
}
