import mongoose from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AutoIncrement = require("mongoose-sequence")(mongoose);

const quotationSchema = new mongoose.Schema(
  {
    quotationDate: {
      type: Date,
      required: [true, "Quotation Date Is Required!"],
    },
    quotationExpiry: {
      type: Date,
      required: [true, "Quotation Expiry Date Is Required!"],
    },
    //TODO: Make required if status is not draft
    lineItems: {
      type: Array,
      // required: [true, "Line Items Are Required!"],
      // validate: {
      //   validator: (v: string[]) => v.length >= 1,
      //   message: "Line Items Should Have At Least 1 Item!",
      // },
    },
    totalAmount: {
      type: Number,
      // required: [true, "Total Amount Is Required!"],
      // min: [0.01, "Total Amount Must Be Greater Than 0!"],
    },
    notes: {
      type: String,
    },
    templateInputs: {
      type: Object,
    },
    status: {
      type: String,
      enum: ["Draft", "Active", "Accepted", "Declined", "Expired"],
      default: "Draft",
      required: [true, "Quotation Status Is Required!"],
    },
    customerEmail: {
      type: String,
      required: [true, "Customer Email Is Required!"],
    },
    customer: {
      type: String,
    },
    declineReason: {
      type: String,
    },
    declineDetails: {
      type: String,
    },
    quoteTemplate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuoteTemplate",
    },
  },
  { versionKey: false, timestamps: true }
);

quotationSchema.plugin(AutoIncrement, { inc_field: "quotationId" });

export default mongoose.models.Quotation ||
  mongoose.model("Quotation", quotationSchema);
