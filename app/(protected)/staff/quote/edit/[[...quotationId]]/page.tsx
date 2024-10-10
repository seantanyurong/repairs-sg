import {
  addQuotation,
  getOneQuotation,
  updateQuotation,
} from "@/lib/actions/quotations";
import { getQuoteTemplates } from "@/lib/actions/quoteTemplates";
import { createClerkClient } from "@clerk/nextjs/server";
import EditQuoteClient from "./clientPage";
import { LineItem } from "../../_components/LineItemColumns";

const EditQuote = async ({ params }: { params: { quotationId?: string } }) => {
  const quoteTemplates = await getQuoteTemplates();

  let quotationFormValues = {
    quotationDate: new Date(),
    notes: "",
    customerEmail: "",
    quoteTemplate: "",
  };

  let templateFormValues = {};
  let lineItems: Array<LineItem> = [];

  if (params.quotationId) {
    const quotation = JSON.parse(await getOneQuotation(params.quotationId));

    quotationFormValues = {
      quotationDate: new Date(),
      notes: quotation.notes,
      customerEmail: "",
      quoteTemplate: quotation.quoteTemplate,
    };

    templateFormValues = quotation.templateInputs;
    lineItems = quotation.lineItems;
  }

  const getCustomerAction = async (email: string) => {
    "use server";

    const custClerk = createClerkClient({
      secretKey: process.env.CUSTOMER_CLERK_SECRET_KEY as string,
    });
    const result = await custClerk.users.getUserList({ emailAddress: [email] });
    if (result.totalCount === 0) {
      return "No customer found with that email address";
    }
    return result.data[0].fullName ?? "";

    // TODO: implement banned user check SR4
  };

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
      templates={JSON.parse(quoteTemplates)}
      getCustomerAction={getCustomerAction}
      quotationFormValues={quotationFormValues}
      templateFormValues={templateFormValues}
      lineItemValues={lineItems}
      submitQuotationAction={submitQuotationAction}
    />
  );
};

export default EditQuote;
