import Quotation from "@/models/Quotation";
import { Template } from "@pdfme/common";

// TODO: Update params to match the Quotation model
const addQuotation = async (quotation: {
  name: string;
  pdfTemplate: Template;
}): Promise<{
  message: string;
}> => {
  if (quotation.name.length === 0) {
    return { message: "Enter a template name" };
  }
  const newQuotation = new Quotation(quotation);
  newQuotation.save();
  return { message: "Quote Template added successfully" };
};

const getQuotations = async () => {
  return await Quotation.find();
};

const getOneQuotation = async (id: string) => {
  const template = await Quotation.findById(id).exec();
  return JSON.stringify(template);
};

const updateQuotation = async (id: string, templateParams: any) => {
  try {
    Quotation.findByIdAndUpdate(id, templateParams).exec();
    return { message: "Quote Template updated successfully" };
  } catch (err) {
    return { message: "An error has occurred, please try again." };
  }
};

const setQuotationInactive = async (id: string) => {
  Quotation.findByIdAndUpdate(id, { status: "Inactive" }).exec();
  return { message: "Quote Template set to inactive" };
};

export {
  addQuotation,
  getQuotations,
  getOneQuotation,
  setQuotationInactive,
  updateQuotation,
};
