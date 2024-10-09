import { getQuoteTemplates } from "@/lib/actions/quoteTemplates";
import { createClerkClient } from "@clerk/nextjs/server";
import CreateQuoteClient from "./clientPage";

const CreateQuote = async () => {
  const quoteTemplates = await getQuoteTemplates();

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
    <CreateQuoteClient
      templates={JSON.parse(quoteTemplates)}
      getCustomerAction={getCustomerAction}
    />
  );
};

export default CreateQuote;
