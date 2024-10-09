import { getOneQuotation } from "@/lib/actions/quotations";
import { getQuoteTemplates } from "@/lib/actions/quoteTemplates";
import { createClerkClient } from "@clerk/nextjs/server";
import EditQuoteClient from "./clientPage";

const EditQuote = async ({ params }: { params: { quotationId?: string } }) => {
  const quoteTemplates = await getQuoteTemplates();

  let quotationFormValues = {
    quotationDate: new Date(),
    notes: "",
    customerEmail: "",
    quoteTemplate: "",
  };

  let templateFormValues = {};

  if (params.quotationId) {
    const quotation = JSON.parse(await getOneQuotation(params.quotationId));
    console.log(quotation);
    quotationFormValues = {
      quotationDate: new Date(),
      notes: quotation.notes,
      customerEmail: "",
      quoteTemplate: quotation.quoteTemplate,
    };

    templateFormValues = quotation.templateInputs;
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

  return (
    <EditQuoteClient
      templates={JSON.parse(quoteTemplates)}
      getCustomerAction={getCustomerAction}
      quotationFormValues={quotationFormValues}
      templateFormValues={templateFormValues}
    />
  );
};

export default EditQuote;
