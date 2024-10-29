import { createClerkClient } from "@clerk/nextjs/server";
import CustomerManagementClient from "./clientPage";
import { User } from "@clerk/backend";

export default async function CustomerManagement() {

  const customerClerk = createClerkClient({
    secretKey: process.env.CUSTOMER_CLERK_SECRET_KEY as string,
  });

  const customerUsers = await customerClerk.users.getUserList();

  return <CustomerManagementClient customerUsers={JSON.parse(JSON.stringify(customerUsers.data as User[]))} />;
}
