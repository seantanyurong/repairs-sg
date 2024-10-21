import { getInvoice } from "@/lib/actions/invoices";
import { getOneQuoteTemplate } from "@/lib/actions/quoteTemplates";
import { getCustomerById } from "@/lib/actions/customers";
import { getStaffById } from "@/lib/actions/staff";
import InvoiceViewerClient from "./InvoiceViewerClient";
import dayjs from "dayjs";

const ViewInvoice = async ({ params }: { params: { invoiceId: string } }) => {
  const invoice = await getInvoice(Number(params.invoiceId));
  console.log(invoice);

  const invoiceTemplate = JSON.parse(
    await getOneQuoteTemplate(invoice.invoiceTemplate),
  );

  const customer = invoice.customer
    ? JSON.parse(await getCustomerById(invoice.customer))
    : undefined;
  console.log(customer);

  const customerDetails = customer
    ? {
        name: customer.fullName ?? `${customer.firstName} ${customer.lastName}`,
        email: customer.emailAddresses[0].emailAddress,
        phone: customer.unsafeMetadata?.phone ?? "NA",
        addressLine1: customer.unsafeMetadata?.address,
        postal: customer.unsafeMetadata?.postal,
      }
    : {
        name: "NA",
        email: "NA",
        phone: "NA",
        addressLine1: "",
        postal: "",
      };

  const staff = invoice.createdBy
    ? JSON.parse(await getStaffById(invoice.createdBy))
    : undefined;
  console.log(staff);

  const staffDetails = staff
    ? {
        name: staff.fullName ?? `${staff.firstName} ${staff.lastName}`,
        email: staff.emailAddresses[0].emailAddress,
        phone: staff.unsafeMetadata?.phone ?? "NA",
      }
    : {
        name: "NA",
        email: "NA",
        phone: "NA",
      };

  // Function to parse each line item
  const parseLineItems = function (lineItems: string[]) {
    return JSON.stringify(
      lineItems.map(function (item: string) {
        const descriptionMatch = item.match(/Description: (.+?) Quantity:/);
        const quantityMatch = item.match(/Quantity: (\d+)/);
        const amountMatch = item.match(/Amount: ([\d.]+)/);

        // Extract values
        const description = descriptionMatch ? descriptionMatch[1].trim() : "";
        const quantity = quantityMatch ? quantityMatch[1] : "0";
        const amount = amountMatch
          ? `$${parseFloat(amountMatch[1]).toFixed(2)}`
          : "$0.00";

        return [description, quantity, amount]; // Return an array for each item
      }),
    );
  };
  const parsedItems = parseLineItems(invoice.lineItems);

  const inputs = [
    {
      invoice_no: `Invoice #${invoice.invoiceId}`,
      invoice_date: dayjs(invoice.dateIssued).format("DD/MM/YYYY"),
      validity_status: invoice.validityStatus,
      line_items: parsedItems,
      total_amount: `$ ${invoice.totalAmount.toFixed(2)}`,
      subtotal: `$ ${invoice.totalAmount.toFixed(2)}`,
      qrcode: invoice.qrCode,
      taxes: `$ 0.00`,
      customer_name: customerDetails.name,
      address_line_1: customerDetails.addressLine1,
      postal_code: `Singapore ${customerDetails.postal}`,
      sales_mobile: staffDetails.phone,
      sales_email: staffDetails.email,
    },
  ];

  return (
    <>
      <div className="flex flex-row justify-between items-center shadow-md rounded-md w-full p-4">
        <h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Invoice #{invoice.invoiceId}
        </h2>
      </div>
      <div className="flex justify-center items-center w-full min-h-screen">
        <div className="flex lg:flex-row flex-col gap-2 w-3/4 h-auto lg:w-2/3">
          {/*h-dvh*/}
          <InvoiceViewerClient
            template={invoiceTemplate.pdfTemplate}
            inputs={inputs}
          />
        </div>
      </div>
    </>
  );
};

export default ViewInvoice;
