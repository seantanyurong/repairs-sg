import {
  getOneQuotation,
  sendQuoteEmail,
  updateQuotation,
} from "@/lib/actions/quotations";
import { getOneQuoteTemplate } from "@/lib/actions/quoteTemplates";
import { getInputFromTemplate, Template } from "@pdfme/common";
import dayjs from "dayjs";
import { QuoteTemplateType } from "../../templates/_components/QuoteTemplateColumns";
import QuoteDetailsClient from "./QuoteDetailsClient";
import QuoteViewerClient from "./QuoteViewerClient";
import QuoteActionsClient from "./QuoteActionsClient";
import { getCustomerById } from "@/lib/actions/customers";
import { generate } from "@pdfme/generator";
import { font, plugins } from "../../templates/_components/pdfSchema";

const populateTemplate = (
  oldTemplate: Template,
  quotation: {
    quotationId: string;
    quotationDate: string | number | Date | dayjs.Dayjs | null | undefined;
    templateInputs: { [x: string]: string };
  }
): Template => {
  const updatedSchema = oldTemplate.schemas[0].map((field) => {
    switch (field.name) {
      case "quotation_no":
        return {
          ...field,
          content: `Quotation #${quotation.quotationId}`,
        };
      case "quote_date":
        return {
          ...field,
          content: dayjs(quotation.quotationDate).format("DD/MM/YYYY"),
        };
      case "line_items":
        return {
          ...field,
          content: JSON.stringify(quotation.templateInputs["line_items"]),
        };
      default: {
        const content = quotation.templateInputs[field.name];
        if (content) {
          return {
            ...field,
            content,
          };
        }
        return field;
      }
    }
  });
  return {
    ...oldTemplate,
    schemas: [updatedSchema],
  };
};

const EditQuote = async ({ params }: { params: { quoteId: string } }) => {
  const quotation = JSON.parse(await getOneQuotation(params.quoteId));
  const quoteTemplate: QuoteTemplateType = JSON.parse(
    await getOneQuoteTemplate(quotation.quoteTemplate)
  );
  const updatedQuoteTemplate = populateTemplate(
    quoteTemplate.pdfTemplate,
    quotation
  );
  const inputs = getInputFromTemplate(updatedQuoteTemplate);
  const customer = quotation.customer
    ? JSON.parse(await getCustomerById(quotation.customer))
    : undefined;

  const customerDetails = customer
    ? {
        name: customer.fullName ?? `${customer.firstName} ${customer.lastName}`,
        email: customer.emailAddresses[0].emailAddress,
        phone: customer.primaryPhoneNumber?.phoneNumber ?? "NA",
      }
    : {
        name: inputs[0].customer_name,
        email: quotation.customerEmail,
        phone: "NA",
      };

  const submitQuotationAction = async (quote: string) => {
    "use server";
    return updateQuotation(params.quoteId, quote);
  };

  const sendEmailAction = async () => {
    "use server";

    const pdf = await generate({
      template: updatedQuoteTemplate,
      inputs,
      options: { font },
      plugins,
    });
    return sendQuoteEmail(params.quoteId, Buffer.from(pdf).toString("base64"));
  };

  const updateQuotationAction = async (
    newStatus: string,
    declineReasons?: {
      declineReason: string;
      declineDetails?: string;
    }
  ) => {
    "use server";

    const payload = declineReasons
      ? { status: newStatus, ...declineReasons }
      : { status: newStatus };
    return updateQuotation(params.quoteId, JSON.stringify(payload));
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center shadow-md rounded-md w-full p-4">
        <h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Quotation #{quotation.quotationId}
        </h2>
        <QuoteActionsClient
          quotationId={params.quoteId}
          status={quotation.status}
          sendEmailAction={sendEmailAction}
          updateQuotationAction={updateQuotationAction}
        />
      </div>
      <div className="flex lg:flex-row flex-col gap-2 h-dvh">
        <QuoteDetailsClient
          quotation={quotation}
          customer={customerDetails}
          updateQuotationAction={submitQuotationAction}
        />
        <QuoteViewerClient
          template={updatedQuoteTemplate}
          inputs={inputs}
        />
      </div>
    </>
  );
};

export default EditQuote;
