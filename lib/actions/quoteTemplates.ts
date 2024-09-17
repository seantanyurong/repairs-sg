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
  console.log(template);
  return template;
};

const updateQuoteTemplate = async (
  id: string,
  templateParams: QuoteTemplateType
) => {
  console.log(id, templateParams);
  return QuoteTemplate.findByIdAndUpdate(id, templateParams);
};

const setQuoteTemplateInactive = async (id: string) => {
  return QuoteTemplate.findByIdAndUpdate(id, { status: "Inactive" });
};

export {
  addQuoteTemplate,
  getOneQuoteTemplate,
  getQuoteTemplates,
  setQuoteTemplateInactive,
  updateQuoteTemplate,
};
