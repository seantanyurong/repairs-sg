"use server";

import Invoice from "@/models/Invoice";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import PaynowQR from "paynowqr";

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
  invoiceTemplate: "Invoice Template",
  qrCode: "QR Code",
  customer: "Customer",
  job: "Job",
  createdBy: "Created By",
  lastUpdatedBy: "Last Updated By",
};

const addInvoice = async (invoice: {
  lineItems: Array<string>;
  totalAmount: number;
  paymentStatus: string;
  validityStatus: string;
  publicNote: string;
  invoiceTemplate: string;
  customer: string;
  job: string;
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
  const dateDue = new Date(dateIssued.getTime() + 14 * 24 * 60 * 60 * 1000);
  const remainingDue = invoice.totalAmount;
  const jobId = new ObjectId(invoice.job);

  //Outputs the qrcode to a UTF-8 string format, which can be passed to a QR code generation script to generate the paynow QR
  const paynowQRCode = new PaynowQR({
    uen: "202100025M", //Required: UEN of company
    amount: invoice.totalAmount, //Specify amount of money to pay.
    refNumber: nextInvoiceId.toString(), //Reference number for Paynow Transaction. Useful if you need to track payments for recouncilation.
    company: "Repair.sg", //Company name to embed in the QR code. Optional.
  });
  const qrString = paynowQRCode.output();

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
    invoiceTemplate: z.string(),
    qrCode: z.string(),
    customer: z
      .string()
      .min(32, "Invalid Customer ID")
      .max(32, "Invalid Customer ID"),
    job: z.custom<ObjectId>(),
    createdBy: z
      .string()
      .min(32, "Invalid Staff ID")
      .max(32, "Invalid Staff ID"),
    lastUpdatedBy: z
      .string()
      .min(32, "Invalid Staff ID")
      .max(32, "Invalid Staff ID"),
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
    invoiceTemplate: invoice.invoiceTemplate,
    qrCode: qrString,
    customer: invoice.customer,
    job: jobId,
    createdBy: invoice.staff,
    lastUpdatedBy: invoice.staff,
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
  _id: string;
  lineItems: Array<string>;
  dateIssued: Date;
  dateDue: Date;
  totalAmount: number;
  remainingDue: number;
  paymentStatus: "Unpaid";
  validityStatus: "draft" | "active";
  publicNote: string;
  customer: string;
  lastUpdatedBy: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const invoiceSchema = z
    .object({
      _id: z.string().min(1),
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
      lastUpdatedBy: z.string(),
    })
    .refine((data) => data.remainingDue <= data.totalAmount, {
      path: ["remainingDue"],
      message: "Remaining Due cannot be more than Total Amount!",
    });

  const response = invoiceSchema.safeParse({
    _id: invoice._id,
    lineItems: invoice.lineItems,
    dateIssued: invoice.dateIssued,
    dateDue: invoice.dateDue,
    totalAmount: invoice.totalAmount,
    remainingDue: invoice.remainingDue,
    paymentStatus: invoice.paymentStatus,
    validityStatus: invoice.validityStatus,
    publicNote: invoice.publicNote,
    customer: invoice.customer,
    lastUpdatedBy: invoice.lastUpdatedBy,
  });

  console.log(response.data);
  if (!response.success) {
    return { message: "", errors: response.error.flatten().fieldErrors };
  }

  const filter = { _id: new ObjectId(response.data._id) };
  const update = {
    lineItems: response.data.lineItems,
    dateIssued: response.data.dateIssued,
    dateDue: response.data.dateDue,
    totalAmount: response.data.totalAmount,
    remainingDue: response.data.remainingDue,
    paymentStatus: response.data.paymentStatus,
    validityStatus: response.data.validityStatus,
    publicNote: response.data.publicNote,
    customer: response.data.customer,
    lastUpdatedBy: response.data.lastUpdatedBy,
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

const makePayment = async (invoice: {
  invoiceId: string;
  totalAmount: number;
  paymentAmount: number;
  remainingDue: number;
  paymentStatus: string;
  lastUpdatedBy: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const invoiceSchema = z.object({
    invoiceId: z.string().min(1),
    remainingDue: z.number().min(0, {
      message: "Remaining Due Cannot Be Negative!",
    }),
    paymentStatus: z.enum(["Unpaid", "Paid"]),
    lastUpdatedBy: z.string(),
  });

  if (invoice.remainingDue === invoice.paymentAmount)
    invoice.paymentStatus = "Paid";

  const response = invoiceSchema.safeParse({
    invoiceId: invoice.invoiceId,
    remainingDue: invoice.remainingDue - invoice.paymentAmount,
    paymentStatus: invoice.paymentStatus,
    lastUpdatedBy: invoice.lastUpdatedBy,
  });

  // console.log(response.data);
  if (!response.success) {
    return { message: "", errors: response.error.flatten().fieldErrors };
  }

  const filter = { invoiceId: response.data.invoiceId };
  const update = {
    remainingDue: response.data.remainingDue,
    paymentStatus: response.data.paymentStatus,
    lastUpdatedBy: response.data.lastUpdatedBy,
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
  return Invoice.findOne({ invoiceId: invoiceId });
};

const getInvoices = async () => {
  const invoices = await Invoice.find()
    .populate("payments")
    .sort({ invoiceId: -1 })
    .limit(20)
    .exec();
  return invoices;
};

const voidInvoice = async (invoice: {
  invoiceId: string;
  validityStatus: "void";
  voidReason: string;
  lastUpdatedBy: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const invoiceSchema = z.object({
    invoiceId: z.string().min(1),
    validityStatus: z.enum(["void"]),
    voidReason: z.string(),
    lastUpdatedBy: z.string(),
  });

  const response = invoiceSchema.safeParse({
    invoiceId: invoice.invoiceId,
    validityStatus: invoice.validityStatus,
    voidReason: invoice.voidReason,
    lastUpdatedBy: invoice.lastUpdatedBy,
  });

  console.log(response.data);
  if (!response.success) {
    return { message: "", errors: response.error.flatten().fieldErrors };
  }

  const filter = { invoiceId: response.data.invoiceId };
  const update = {
    validityStatus: response.data.validityStatus,
    voidReason: response.data.voidReason,
    lastUpdatedBy: response.data.lastUpdatedBy,
  };

  const context = { runValidators: true, context: "query" };

  try {
    await Invoice.findOneAndUpdate(filter, update, context);
    revalidatePath("/staff/invoices");
    return { message: "Invoices Voided Successfully" };
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

export {
  addInvoice,
  updateInvoice,
  makePayment,
  getInvoice,
  getInvoices,
  voidInvoice,
};
