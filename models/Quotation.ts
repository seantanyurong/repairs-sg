import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    quotationId: {
      type: Number,
      required: [true, "Quotation ID Is Required!"],
      unique: true,
    },
    dateCreated: {
      type: Date,
      required: [true, "Date Created Is Required!"],
    },
    lineItems: {
      type: Array,
      required: [true, "Line Items Are Required!"],
      validate: {
        validator: (v: string[]) => v.length >= 1,
        message: "Line Items Should Have At Least 1 Item!",
      },
    },
    totalAmount: {
      type: Number,
      required: [true, "Total Amount Is Required!"],
      min: [0.01, "Total Amount Must Be Greater Than 0!"],
    },
    public_note: {
      type: String,
      maxlength: [500, "Public Note Can Have At Most 500 Characters"],
    },
    private_notes: {
      type: String,
      maxlength: [500, "Private Note Can Have At Most 500 Characters"],
    },
    filesWithURL: {
      type: Array,
    },
    secret: {
      type: String,
    },
    status: {
      type: String,
      default: "Draft",
      required: [true, "Quotation Status Is Required!"],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    jobAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    billingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    accept: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accept",
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.models.Quotation ||
  mongoose.model("Quotation", quotationSchema);
