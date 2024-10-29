import { clerkClient } from "@clerk/nextjs/server";
import CustomerManagementClient from "./clientPage";
import { User } from "@clerk/backend";

export default async function CustomerManagement() {
  const customerUsers = await clerkClient().users.getUserList();

  return <CustomerManagementClient customerUsers={JSON.parse(JSON.stringify(customerUsers.data as User[]))} />;
}
