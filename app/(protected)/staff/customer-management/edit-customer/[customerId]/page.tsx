import EditCustomerClient from "./clientPage";
import { clerkClient } from "@clerk/nextjs/server";

export default async function EditCustomer({
  params,
}: {
  params: { customerId: string };
}) {
  const customer = await clerkClient().users.getUser(params.customerId);

  return (
    <EditCustomerClient
      customer={{
        id: params.customerId,
        imageUrl: customer.imageUrl,
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.emailAddresses[0].emailAddress || "",
        role: (customer.publicMetadata.role as string) || "",
        phone: (customer.unsafeMetadata.phone as string) || "",
      }}
    />
  );
}
