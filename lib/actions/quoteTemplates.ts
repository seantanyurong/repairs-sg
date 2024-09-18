"use server";

import { QuoteTemplateType } from "@/app/(staff-only)/staff/quote/templates/edit/[[...templateId]]/page";
import QuoteTemplate from "@/models/QuoteTemplate";
import { Template } from "@pdfme/common";

const addQuoteTemplate = async (quoteTemplate: {
  name: string;
  pdfTemplate: Template;
}): Promise<{
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
  return await QuoteTemplate.find();
};

const getOneQuoteTemplate = async (id: string) => {
  const template = await QuoteTemplate.findById(id).exec();
  return JSON.stringify(template);
};

const updateQuoteTemplate = async (
  id: string,
  templateParams: QuoteTemplateType
) => {
  try {
    QuoteTemplate.findByIdAndUpdate(id, templateParams);
    return { message: "Quote Template updated successfully" };
  } catch (err) {
    return { message: "An error has occurred, please try again." };
  }
};

const setQuoteTemplateInactive = async (id: string) => {
  QuoteTemplate.findByIdAndUpdate(id, { status: "Inactive" });
  return { message: "Quote Template set to inactive" };
};

export {
  addQuoteTemplate,
  getOneQuoteTemplate,
  getQuoteTemplates,
  setQuoteTemplateInactive,
  updateQuoteTemplate,
};
