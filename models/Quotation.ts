import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema({
    quptationId: {
        type: Number,
        required: [true, "Quotation ID Is Required!"],
        unique: true
    },
    dateCreated: {
        type: Date,
        required: [true, "Date Created Is Required!"],
    },
    lineItems: {
        type: Array,
        required: [true, "Line Items Are Required!"],
    },
    totalAmount: {
        type: Number,
        required: [true, "Total Amount Is Required!"],
    },
    public_note: {
        type: String
    },
    private_notes: {
        type: Array
    },
    filesWithURL: {
        type: Array
    },
    secret: {
        type: String
    },
    status: {
        type: String,
        default: "Draft",
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    },
    jobAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    billingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    }],
    accept: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Accept"
    }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Quotation || mongoose.model('Quotation', quotationSchema);
