import { getInvoice } from "@/lib/actions/invoices";
import { getOneQuoteTemplate } from "@/lib/actions/quoteTemplates";
import { getCustomerById } from "@/lib/actions/customers";
import { /*getInputFromTemplate,*/ Template } from "@pdfme/common";
// import { generate } from "@pdfme/generator";
// import { font, plugins } from "../../../quote/templates/_components/pdfSchema";
import InvoiceViewerClient from "./InvoiceViewerClient";
import dayjs from "dayjs";

const populateTemplate = (
  oldTemplate: Template,
  invoice: {
    invoiceId: number;
    dateIssued: string | number | Date | dayjs.Dayjs | null | undefined;
    totalAmount: number;
    lineItems: Array<string>;
    invoiceTemplate: string;
    qrCode: string;
    customer: string;
    // templateInputs: { [x: string]: string };
  }
): Template => {
  const updatedSchema = oldTemplate.schemas[0].map((field) => {
    switch (field.name) {
      case "invoice_no":
        return {
          ...field,
          content: `Invoice #${invoice.invoiceId}`,
        };
      case "invoice_date":
        return {
          ...field,
          content: dayjs(invoice.dateIssued).format("DD/MM/YYYY"),
        };
      case "line_items":
        return {
          ...field,
          content: JSON.stringify(invoice.lineItems),
        };
      case "total_amount":
        return {
          ...field,
          content: invoice.totalAmount,
        };
      case "subtotal":
        return {
          ...field,
          content: invoice.totalAmount,
        };
      case "qrcode":
        return {
          ...field,
          content: btoa(invoice.qrCode),
        };
      // default: {
      //   const content = invoice.templateInputs[field.name];
      //   if (content) {
      //     return {
      //       ...field,
      //       content,
      //     };
      //   }
      //   return field;
      // }
    }
  });
  return {
    ...oldTemplate,
    schemas: [updatedSchema],
  };
};

const ViewInvoice = async ({ params }: { params: { invoiceId: string } }) => {
  const invoice = await getInvoice(Number(params.invoiceId));
  console.log(invoice);
  const invoiceTemplate = JSON.parse(await getOneQuoteTemplate(invoice.invoiceTemplate));
  console.log(invoiceTemplate);

  const updatedInvoiceTemplate = populateTemplate(
    invoiceTemplate.pdfTemplate,
    invoice
  );

  const customer = invoice.customer
    ? JSON.parse(await getCustomerById(invoice.customer))
    : undefined;

  const customerDetails = customer
    ? {
        name: customer.fullName ?? `${customer.firstName} ${customer.lastName}`,
        email: customer.emailAddresses[0].emailAddress,
        phone: customer.primaryPhoneNumber?.phoneNumber ?? "NA",
      }
    : {
        name: "NA",
        email: "NA",
        phone: "NA",
      };

    const inputs = [
      {
        invoice_no: `Invoice #${invoice.invoiceId}`,
        invoice_date: dayjs(invoice.dateIssued).format("DD/MM/YYYY"),
        line_items: JSON.stringify(invoice.lineItems),
        totalAmount: invoice.totalAmount.toString(),
        qrCode: invoice.qrCode,
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
        <div className="flex lg:flex-row flex-col gap-2 w-3/4 h-auto lg:w-2/3"> {/*h-dvh*/}
          <InvoiceViewerClient
            template={updatedInvoiceTemplate}
            inputs={inputs}
          />
        </div>
      </div>
    </>
  );
};

export default ViewInvoice;
