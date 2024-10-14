import mongoose from "mongoose";
const uniqueValidator = require('mongoose-unique-validator');

const invoiceSchema = new mongoose.Schema({
    invoiceId: {
        type: Number,
        required: [true, "Invoice ID Is Required!"],
        unique: true
    },
    lineItems: [{
        type: String,
        required: [true, "Line Items Are Required!"],
        validate: {
            validator: (v: String[]) => v.length >= 1, 
            message: "Line Items Should Have At Least 1 Item!"
        }
    }],
    dateIssued: {
        type: Date,
        required: [true, "Date Issued Is Required!"]
    },
    dateDue: {
        type: Date,
        required: [true, "Date Due Is Required!"],
        validate: {
            validator: function (value: Date) {
                return value > new Date();
            },
            message: "Date Must Be In The Future!"
        }
    },
    totalAmount: {
        type: Number,
        required: [true, "Total Amount Is Required!"],
        min: [0.01, 'Total Amount Must Be Greater Than 0!'],
    },
    remainingDue: {
        type: Number,
        required: [true, "Remaining Due Is Required!"]
    },
    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Paid'],
        default: 'Unpaid',
        required: [true, "Invoice Payment Status Is Required!"]
    },
    validityStatus: {
        type: String,
        enum: ['draft', 'active', 'void'],
        default: 'draft',
        required: [true, "Invoice Validity Status Is Required!"]
    },
    publicNote: {
        type: String,
        maxlength: [500, 'Public Note Can Have At Most 500 Characters']
    },
    // secret: {
    //     type: String
    // },
    // customer: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Customer",
    //     required: [true, "Customer Is Required!"]
    // },
    // customer: {
    //     type: String,
    //     required: [true, "Customer Is Required!"]
    // },
    // job: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Job",
    //     required: [true, "Job Is Required!"]
    // },
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    }],
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    }],
    // createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Staff",
    //     required: [true, "Created By Is Required!"]
    // },
    // lastUpdatedBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Staff",
    //     required: [true, "Last Updated By Is Required!"]
    // }
}, { versionKey: false, timestamps: true });

invoiceSchema.plugin(uniqueValidator, { message: '{VALUE} already exists' });

export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
