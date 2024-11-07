"use server";

import Quotation from "@/models/Quotation";
import { z } from "zod";
import { getCustomerById } from "./customers";
import { User } from "@clerk/nextjs/server";
import { sendQuoteEmailPostmark } from "../postmark";

const quotationSchema = z.object({
  quotationDate: z.string().min(1),
  quotationExpiry: z.string().min(1),
  quoteTemplate: z.string().min(1),
  customerEmail: z.string().email(),
  totalAmount: z.number(),
  notes: z.string().optional(),
  lineItems: z
    .object({
      description: z.string(),
      quantity: z.number(),
      total: z.number(),
    })
    .array()
    .optional(),
  customer: z.string().optional(),
  declineReason: z.string().optional(),
  declineDetails: z.string().optional(),
});

const addQuotation = async (
  quote: string,
  templateInputs: string
): Promise<{
  message: string;
  id?: string;
  errors?: string | Record<string, unknown>;
}> => {
  const quotation = JSON.parse(quote);
  const response = quotationSchema.safeParse(quotation);

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const newQuotation = new Quotation({
    ...response.data,
    templateInputs: JSON.parse(templateInputs),
  });
  newQuotation.save();

  return { message: "Quotation added successfully", id: newQuotation._id };
};

const getQuotations = async () => {
  return await Quotation.find();
};

const getOneQuotation = async (id: string) => {
  const template = await Quotation.findById(id).exec();
  return JSON.stringify(template);
};

const updateQuotation = async (
  id: string,
  quote: string,
  templateInputs?: string
) => {
  try {
    if (templateInputs) {
      const quotation = JSON.parse(quote);
      const response = quotationSchema.safeParse(quotation);

      if (!response.success) {
        return {
          message: "Error",
          errors: response.error.flatten().fieldErrors,
        };
      }

      const updatedQuotation = await Quotation.findByIdAndUpdate(id, {
        ...response.data,
        templateInputs: JSON.parse(templateInputs),
      }).exec();
      return {
        message: "Quotation updated successfully",
        id: updatedQuotation._id,
      };
    } else {
      const updatedQuotation = await Quotation.findByIdAndUpdate(id, {
        ...JSON.parse(quote),
      }).exec();
      return {
        message: "Quotation updated successfully",
        id: updatedQuotation._id,
      };
    }
  } catch (err) {
    console.error(err);
    return { message: "An error has occurred, please try again." };
  }
};

const deleteQuotation = async (id: string) => {
  Quotation.findByIdAndDelete(id).exec();
  return { message: "Quotation Deleted" };
};

const sendQuoteEmail = async (id: string, attachment: string) => {
  const quotation = await Quotation.findById(id).exec();
  let customerEmail = "";
  let customerName = "";
  if (quotation.customer) {
    const customer: User = JSON.parse(
      await getCustomerById(quotation.customer)
    );
    customerEmail =
      customer.primaryEmailAddress?.emailAddress ??
      customer.emailAddresses[0].emailAddress;

    customerName =
      customer.fullName ?? `${customer.firstName} ${customer.lastName}`;
  } else {
    customerEmail = quotation.customerEmail;
    customerName = quotation.templateInputs["customer_name"];
  }

  await sendQuoteEmailPostmark(
    customerEmail,
    "Quotation from Repair.sg",
    QUOTE_EMAIL_COPY.replace("{ customerName }", customerName).replace(
      "{ quoteLink }",
      `http://localhost:8000/customer/quotations/view/${id}`
    ),
    attachment
  );
};

const getQuotationsByCustomerId = async (customerId: string) => {
  return Quotation.find({ customer: customerId });
};

const QUOTE_EMAIL_COPY =
  "Hi { customerName },\n\nThank you considering Repair.sg. We help make repair, installation, and maintenance easy for more than 15,000 businesses and homeowners. Let us help you next!\n\nPlease find attached your quote. You may also access it from { quoteLink }\n\nShould you require any further information, please do not hesitate to contact us.\n\nBest Regards,\nRepair.sg Team";

export {
  addQuotation,
  getOneQuotation,
  getQuotations,
  updateQuotation,
  deleteQuotation,
  sendQuoteEmail,
  getQuotationsByCustomerId,
};
