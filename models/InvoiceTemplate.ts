import mongoose from "mongoose";

const invoiceTemplateSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Template Name is required"],
    },
    pdfTemplate: {
      type: Object,
      required: [true, "PDF Template Is Required"],
    },
  }, { versionKey: false, timestamps: true }
);

export default mongoose.models.InvoiceTemplate || mongoose.model("InvoiceTemplate", invoiceTemplateSchema);
