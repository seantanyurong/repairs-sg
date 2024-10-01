"use server";

import Quotation from "@/models/Quotation";
import { z } from "zod";

const addQuotation = async (
  // quotation: {
  //   quotationDate: Date;
  //   customerEmail: string;
  //   quoteTemplate: string;
  //   notes?: string;
  // },
  quote: string,
  templateInputs: string
): Promise<{
  message: string;
  id?: string;
  errors?: string | Record<string, unknown>;
}> => {
  const quotationSchema = z.object({
    quotationDate: z.string().min(1),
    quoteTemplate: z.string().min(1),
    customerEmail: z.string().min(1),
    notes: z.string().optional(),
  });

  const quotation = JSON.parse(quote);
  const response = quotationSchema.safeParse({
    quotationDate: quotation.quotationDate,
    quoteTemplate: quotation.quoteTemplate,
    customerEmail: quotation.customerEmail,
    notes: quotation.notes,
  });

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }
  console.log(templateInputs);

  const newQuotation = new Quotation({
    ...response.data,
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
  templateParams: { notes: string }
) => {
  try {
    Quotation.findByIdAndUpdate(id, templateParams).exec();
    return { message: "Quote Template updated successfully" };
  } catch (err) {
    console.error(err);
    return { message: "An error has occurred, please try again." };
  }
};

const setQuotationInactive = async (id: string) => {
  Quotation.findByIdAndUpdate(id, { status: "Inactive" }).exec();
  return { message: "Quote Template set to inactive" };
};

export {
  addQuotation,
  getOneQuotation,
  getQuotations,
  updateQuotation,
  setQuotationInactive,
};
