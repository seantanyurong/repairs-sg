"use server";

import { QuoteTemplateCreate } from "@/app/(protected)/staff/quote/templates/edit/[[...templateId]]/page";
import QuoteTemplate from "@/models/QuoteTemplate";

const addQuoteTemplate = async (
  quoteTemplate: QuoteTemplateCreate
): Promise<{
  message: string;
}> => {
  if (quoteTemplate.name.length === 0) {
    return { message: "Enter a template name" };
  }
  const newQuoteTemplate = new QuoteTemplate(quoteTemplate);
  newQuoteTemplate.save();
  return { message: "Quote Template added successfully" };
};

const getQuoteTemplates = async () => {
  return JSON.stringify(await QuoteTemplate.find());
};

const getOneQuoteTemplate = async (id: string) => {
  const template = await QuoteTemplate.findById(id).exec();
  return JSON.stringify(template);
};

const updateQuoteTemplate = async (
  id: string,
  templateParams: QuoteTemplateCreate
) => {
  try {
    QuoteTemplate.findByIdAndUpdate(id, templateParams).exec();
    return { message: "Quote Template updated successfully" };
  } catch {
    return { message: "An error has occurred, please try again." };
  }
};

const setQuoteTemplateInactive = async (id: string) => {
  QuoteTemplate.findByIdAndUpdate(id, { status: "Inactive" }).exec();
  return { message: "Quote Template set to inactive" };
};

export {
  addQuoteTemplate,
  getOneQuoteTemplate,
  getQuoteTemplates,
  setQuoteTemplateInactive,
  updateQuoteTemplate,
};
