"use server";

import Invoice from "@/models/Invoice";
import mongoose from "mongoose";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const fieldFriendlyNames: Record<string, string> = {
  invoiceId: "Invoice ID",
  lineItems: "Line Items",
  dateIssued: "Issued Date",
  dateDue: "Due Date",
  totalAmount: "Total Amount",
  remainingDue: "Remaining Due",
  paymentStatus: "Payment Status",
  validityStatus: "Validity Status",
  publicNote: "Note",
};

const addInvoice = async (invoice: {
  lineItems: Array<string>;
  totalAmount: number;
  paymentStatus: string;
  validityStatus: string;
  publicNote: string;
  customer: string;
  staff: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  // Fetch Latest Invoice
  const getLatestInvoice = async () => {
    const latestInvoice = await Invoice.findOne()
      .populate("payments")
      .sort({ invoiceId: -1 });
    return latestInvoice;
  };

  // Calculated Fields
  const latestInvoice = await getLatestInvoice();
  const nextInvoiceId = latestInvoice ? latestInvoice.invoiceId + 1 : 1;
  const dateIssued = new Date();
  const dateDue = new Date(dateIssued.getTime() + 7 * 24 * 60 * 60 * 1000);
  const remainingDue = invoice.totalAmount;
  const createdBy = invoice.staff;
  const lastUpdatedBy = invoice.staff;

  const invoiceSchema = z.object({
    invoiceId: z.number(),
    lineItems: z
      .array(z.string())
      .nonempty("Line Items Should Have At Least 1 Item!"),
    dateIssued: z
      .date()
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Invalid Date",
      }),
    dateDue: z
      .date()
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Invalid Date",
      })
      .refine((date) => date instanceof Date && date > new Date(), {
        message: "Date Must Be In The Future!",
      }),
    totalAmount: z.number().min(0.01, {
      message: "Total Amount Must Be Greater Than 0!",
    }),
    remainingDue: z.number().min(0, {
      message: "Remaining Due Cannot Be Negative!",
    }),
    paymentStatus: z.enum(["Unpaid", "Paid"]),
    validityStatus: z.enum(["draft", "active", "void"]),
    publicNote: z.string().max(500),
    customer: z.string(),
    createdBy: z.string(),
    lastUpdatedBy: z.string(),
  });

  const response = invoiceSchema.safeParse({
    invoiceId: nextInvoiceId,
    lineItems: invoice.lineItems,
    dateIssued: dateIssued,
    dateDue: dateDue,
    totalAmount: invoice.totalAmount,
    remainingDue: remainingDue,
    paymentStatus: invoice.paymentStatus,
    validityStatus: invoice.validityStatus,
    publicNote: invoice.publicNote,
    customer: invoice.customer,
    createdBy: createdBy,
    lastUpdatedBy: lastUpdatedBy,
  });

  console.log(response.data);
  if (!response.success) {
    return { message: "", errors: response.error.flatten().fieldErrors };
  }

  try {
    const newInvoice = new Invoice(response.data);
    await newInvoice.save();

    return { message: "Invoice Added Successfully" };
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError && error.errors) {
      // Mongoose validation errors (including unique-validator errors)
      const mongooseErrors = Object.keys(error.errors).reduce(
        (acc, key) => {
          const friendlyKey = fieldFriendlyNames[key] || key;
          const errorMessage = error.errors[key].message.replace(
            key,
            friendlyKey,
          );
          acc[friendlyKey] = [errorMessage];
          return acc;
        },
        {} as Record<string, string[]>,
      );

      return { message: "Validation Error", errors: mongooseErrors };
    }

    return { message: "An Unexpected Error Occurred" };
  }
};

const updateInvoice = async (invoice: {
  invoiceId: number;
  lineItems: Array<string>;
  dateIssued: Date;
  dateDue: Date;
  totalAmount: number;
  remainingDue: number;
  paymentStatus: string;
  validityStatus: string;
  publicNote: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const invoiceSchema = z.object({
    invoiceId: z.number(),
    lineItems: z
      .array(z.string())
      .nonempty("Line Items Should Have At Least 1 Item!"),
    dateIssued: z
      .date()
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Invalid Date",
      }),
    dateDue: z
      .date()
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Invalid Date",
      })
      .refine((date) => date instanceof Date && date > new Date(), {
        message: "Date Must Be In The Future!",
      }),
    totalAmount: z.number().min(0.01, {
      message: "Total Amount Must Be Greater Than 0!",
    }),
    remainingDue: z.number().min(0, {
      message: "Remaining Due Cannot Be Negative!",
    }),
    paymentStatus: z.enum(["Unpaid", "Paid"]),
    validityStatus: z.enum(["Draft", "Active", "Void"]),
    publicNote: z.string().max(500),
  });

  const response = invoiceSchema.safeParse({
    invoiceId: invoice.invoiceId,
    lineItems: invoice.lineItems,
    dateIssued: invoice.dateIssued,
    dateDue: invoice.dateDue,
    totalAmount: invoice.totalAmount,
    remainingDue: invoice.remainingDue,
    paymentStatus: invoice.paymentStatus,
    validityStatus: invoice.validityStatus,
    publicNote: invoice.publicNote,
  });

  console.log(response.data);
  if (!response.success) {
    return { message: "", errors: response.error.flatten().fieldErrors };
  }

  const filter = { invoiceId: response.data.invoiceId };
  const update = {
    invoiceId: response.data.invoiceId,
    lineItems: response.data.lineItems,
    dateIssued: response.data.dateIssued,
    dateDue: response.data.dateDue,
    totalAmount: response.data.totalAmount,
    remainingDue: response.data.remainingDue,
    paymentStatus: response.data.paymentStatus,
    validityStatus: response.data.validityStatus,
    publicNote: response.data.publicNote,
  };
  const context = { runValidators: true, context: "query" };

  try {
    await Invoice.findOneAndUpdate(filter, update, context);
    revalidatePath("/staff/invoices");
    return { message: "Invoices Updated Successfully" };
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError && error.errors) {
      // Mongoose validation errors (including unique-validator errors)
      const mongooseErrors = Object.keys(error.errors).reduce(
        (acc, key) => {
          const friendlyKey = fieldFriendlyNames[key] || key;
          const errorMessage = error.errors[key].message.replace(
            key,
            friendlyKey,
          );
          acc[friendlyKey] = [errorMessage];
          return acc;
        },
        {} as Record<string, string[]>,
      );

      return { message: "Validation Error", errors: mongooseErrors };
    }

    return { message: "An Unexpected Error Occurred" };
  }
};

const getInvoice = async (invoiceId: number) => {
  return Invoice.findById(invoiceId);
};

const getInvoices = async () => {
  const invoices = await Invoice.find()
    .populate("payments")
    .sort({ invoiceId: -1 })
    .limit(20)
    .exec();
  return invoices;
};

export { addInvoice, updateInvoice, getInvoice, getInvoices };
