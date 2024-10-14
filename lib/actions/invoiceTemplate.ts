'use server';

import InvoiceTemplate from "@/models/InvoiceTemplate";

const getInvoiceTemplate = async () => {
  return JSON.stringify(await InvoiceTemplate.find());
};

export { getInvoiceTemplate };