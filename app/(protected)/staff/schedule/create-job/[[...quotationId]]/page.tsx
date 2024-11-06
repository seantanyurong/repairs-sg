import { getServices } from "@/lib/actions/services";
import BookingClient from "./clientPage";
import { createClerkClient } from "@clerk/nextjs/server";
import { getOneQuotation } from "@/lib/actions/quotations";

export default async function Booking({
  params,
}: {
  params: { quotationId?: string };
}) {
  const services = await getServices();

  const quotation = params.quotationId
    ? JSON.parse(await getOneQuotation(params.quotationId))
    : null;

  console.log(quotation);
  // convert this into an array
  const serviceArray = services.map((service) => {
    return {
      _id: service._id.toString(),
      name: service.name,
      description: service.description,
      price: service.price,
      volumeDiscountPercentage: service.volumeDiscountPercentage,
      status: service.status,
    };
  });

  const custClerk = createClerkClient({
    secretKey: process.env.CUSTOMER_CLERK_SECRET_KEY,
  });
  const customers = await custClerk.users.getUserList();

  // convert this PaginatedResourceResponse<User[]>into an array
  const customerArray = customers.data.map((customer) => {
    return {
      id: String(customer.id).trim(),
      name: customer.firstName + " " + customer.lastName,
    };
  });

  return (
    <BookingClient
      services={serviceArray}
      customers={customerArray}
    />
  );
}
