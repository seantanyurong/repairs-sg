import { getCustomerByEmail } from "@/lib/actions/customers";
import {
  addQuotation,
  getOneQuotation,
  updateQuotation,
} from "@/lib/actions/quotations";
import { getQuoteTemplates } from "@/lib/actions/quoteTemplates";
import dayjs from "dayjs";
import { redirect } from "next/navigation";
import { LineItem } from "./_components/LineItemColumns";
import EditQuoteClient from "./clientPage";

const replaceNullsWithEmptyStrings = (obj: unknown): unknown => {
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        replaceNullsWithEmptyStrings(value),
      ])
    );
  } else {
    return obj === null ? "" : obj;
  }
};

const EditQuote = async ({ params }: { params: { quotationId?: string } }) => {
  const quoteTemplates = await getQuoteTemplates();
  const activeTemplates = JSON.parse(quoteTemplates).filter(
    (quote: { status: "Active" | "Inactive" }) => quote.status === "Active"
  );

  let quotationFormValues = {
    quotationDate: new Date(),
    quotationExpiry: dayjs().add(30, "days").toDate(),
    notes: "",
    customerEmail: "",
    quoteTemplate: "",
  };

  let templateFormValues: unknown = {};
  let lineItems: Array<LineItem> = [
    {
      description: "Transport Fee",
      quantity: 1,
      total: 40,
    },
  ];

  if (params.quotationId) {
    const quotation = JSON.parse(await getOneQuotation(params.quotationId));
    if (quotation.status !== "Draft")
      redirect(`/staff/quote/view/${params.quotationId}`);

    quotationFormValues = {
      quotationDate: new Date(quotation.quotationDate),
      quotationExpiry: new Date(quotation.quotationExpiry),
      notes: quotation.notes,
      customerEmail: quotation.customerEmail,
      quoteTemplate: quotation.quoteTemplate,
    };

    templateFormValues = replaceNullsWithEmptyStrings(quotation.templateInputs);

    lineItems = quotation.lineItems;
  }

  const submitQuotationAction = async (
    quote: string,
    templateInputs: string
  ) => {
    "use server";
    console.log(params.quotationId);
    if (params.quotationId) {
      return updateQuotation(params.quotationId, quote, templateInputs);
    } else {
      return addQuotation(quote, templateInputs);
    }
  };

  return (
    <EditQuoteClient
      templates={activeTemplates}
      getCustomerAction={getCustomerByEmail}
      quotationFormValues={quotationFormValues}
      templateFormValues={templateFormValues as { [x: string]: unknown }}
      lineItemValues={lineItems}
      submitQuotationAction={submitQuotationAction}
    />
  );
};

export default EditQuote;
