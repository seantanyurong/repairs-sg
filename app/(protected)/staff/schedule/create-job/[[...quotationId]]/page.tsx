import { getServices } from "@/lib/actions/services";
import BookingClient from "./clientPage";
import { createClerkClient } from "@clerk/nextjs/server";
import { getOneQuotation } from "@/lib/actions/quotations";

export default async function Booking({
  params,
}: {
  params: { quotationId?: string };
}) {
  if (params.quotationId) {
    const quotation = JSON.parse(await getOneQuotation(params.quotationId));

    const formattedLineItems = quotation.lineItems
      .map(
        (lineItem: {
          description: string;
          quantity: number;
          total: number;
        }) => {
          return `${lineItem.quantity} x ${lineItem.description}  = $${lineItem.total}`;
        }
      )
      .join("\n");

    const values = {
      description: `Notes: ${quotation.notes}\n\n${formattedLineItems}`,
      jobAddress: `${quotation.templateInputs.address_line_1} ${quotation.templateInputs.address_line_2 ?? ""} Singapore ${quotation.templateInputs.postal_code}`,
      customer: quotation.customer,
    };

    const serviceArray = [
      {
        _id: "672cc110c38a568d9ac4f519",
        name: "Custom",
        description: "",
        price: quotation.totalAmount / 1.09,
        volumeDiscountPercentage: 0,
        status: "Active",
      },
    ];

    const customerArray = [
      {
        id: quotation.customer,
        name: quotation.templateInputs.customer_name,
      },
    ];

    return (
      <BookingClient
        services={serviceArray}
        customers={customerArray}
        defaultValues={values}
      />
    );
  } else {
    const services = await getServices();

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
}
