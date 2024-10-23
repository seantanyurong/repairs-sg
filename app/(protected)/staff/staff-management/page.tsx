import { clerkClient } from "@clerk/nextjs/server";
import StaffManagementClient from "./clientPage";
import { User } from "@clerk/backend";

export default async function StaffManagement() {
  const staffUsers = await clerkClient().users.getUserList();

  return <StaffManagementClient staffUsers={JSON.parse(JSON.stringify(staffUsers.data as User[]))} />;
}
