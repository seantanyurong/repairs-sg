import mongoose from "mongoose";

const quoteTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: { required: true, message: "Template Name is required" },
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  pdfTemplate: {
    type: Object,
    required: { required: true, message: "PDF Template is required" },
  },
});

export default mongoose.models.QuoteTemplate ||
  mongoose.model("QuoteTemplate", quoteTemplateSchema);
