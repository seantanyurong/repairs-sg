import mongoose from "mongoose";

const quoteTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: { required: true, message: "Template Name is required" },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    pdfTemplate: {
      type: Object,
      required: { required: true, message: "PDF Template is required" },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.models.QuoteTemplate ||
  mongoose.model("QuoteTemplate", quoteTemplateSchema);
