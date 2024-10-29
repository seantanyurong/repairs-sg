import EditCustomerClient from "./clientPage";
import { createClerkClient } from "@clerk/nextjs/server";

export default async function EditCustomer({
  params,
}: {
  params: { customerId: string };
}) {

  const customerClerk = createClerkClient({
    secretKey: process.env.CUSTOMER_CLERK_SECRET_KEY as string,
  });

  const customer = await customerClerk.users.getUser(params.customerId);

  return (
    <EditCustomerClient
      customer={{
        id: params.customerId,
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.emailAddresses[0].emailAddress || "",
        status: (customer.publicMetadata.status as string) || "",
      }}
    />
  );
}
