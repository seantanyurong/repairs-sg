import { getQuoteTemplates } from "@/lib/actions/quoteTemplates";
import { clerkClient } from "@clerk/nextjs/server";
import CreateQuoteClient from "./clientPage";

const CreateQuote = async () => {
  const quoteTemplates = await getQuoteTemplates();

  const getCustomerAction = async (email: string) => {
    "use server";
    const result = await clerkClient().users.getUserList({
      emailAddress: [email],
    });

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
