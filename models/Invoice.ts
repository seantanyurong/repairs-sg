import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    invoiceId: {
        type: Number,
        required: [true, "Invoice ID Is Required!"],
        unique: true
    },
    lineItems: [{
        type: String,
        required: [true, "Line Items Are Required!"]
    }],
    dateIssued: {
        type: Date,
        required: [true, "Date Issued Is Required!"]
    },
    dateDue: {
        type: Date,
        required: [true, "Date Due Is Required!"]
    },
    totalAmount: {
        type: Number,
        required: [true, "Total Amount Is Required!"]
    },
    remainingDue: {
        type: Number,
        required: [true, "Remaining Due Is Required!"]
    },
    publicNote: {
        type: String
    },
    secret: {
        type: String
    },
    status: {
        type: String,
        default: 'Draft',
        required: [true, "Invoice Status Is Required!"]
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: [true, "Job Is Required!"]
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: [true, "Customer Is Required!"]
    },
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    }],
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: [true, "Created By Is Required!"]
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: [true, "Last Updated By Is Required!"]
    }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
