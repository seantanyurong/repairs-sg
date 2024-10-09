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
    quotationExpiry: z.date().optional(),
    quoteTemplate: z.string().min(1),
    customerEmail: z.string().min(1),
    totalAmount: z.number(),
    notes: z.string().optional(),
  });

  const quotation = JSON.parse(quote);
  const response = quotationSchema.safeParse(quotation);

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }
  console.log(response.data);
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

const deleteQuotation = async (id: string) => {
  Quotation.findByIdAndDelete(id).exec();
  return { message: "Quotation Deleted" };
};

export {
  addQuotation,
  getOneQuotation,
  getQuotations,
  updateQuotation,
  deleteQuotation,
};
