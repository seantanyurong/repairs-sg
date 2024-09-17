"use server";

import { z } from "zod";
import QuoteTemplate from "@/models/QuoteTemplate";
import { Template } from "@pdfme/common";

const addQuoteTemplate = async (quoteTemplate: {
  name: string;
  pdfTemplate: Template;
}): Promise<{
  message: string;
  errors?: string | Record<string, unknown>;
}> => {
  const quoteTemplateSchema = z.object({
    name: z.string().min(1),
    pdfTemplate: z.object({}),
  });

  const response = quoteTemplateSchema.passthrough().safeParse(quoteTemplate);

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  } else {
    const newQuoteTemplate = new QuoteTemplate(response.data);
    newQuoteTemplate.save();
    return { message: "Quote Template added successfully" };
  }
};

const getQuoteTemplates = async () => {
  return QuoteTemplate.find();
};

const getOneQuoteTemplate = async (id: string) => {
  return QuoteTemplate.findById(id);
};

const setQuoteTemplateInactive = async (id: string) => {
  return QuoteTemplate.findByIdAndUpdate(id, { status: "Inactive" });
};

export {
  addQuoteTemplate,
  getQuoteTemplates,
  getOneQuoteTemplate,
  setQuoteTemplateInactive,
};
