import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    paymentId: {
        type: Number,
        required: [true, "Payment ID Is Required!"],
        unique: true
    },
    paymentDate: {
        type: Date,
        required: [true, "Payment Date Is Required"]
    },
    amount: {
        type: Number,
        required: [true, "Amount Is Required"]
    },
    paymentMethod: {
        type: String,
        enum: ['BANKTRANSFER', 'CASH', 'PAYLAH', 'PAYNOW'],
        required: [true, "Payment Method Is Required"]
    },
    note: {
        type: String
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
        required: [true, "Invoice Is Required"]
    },
    collectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: [true, "Staff Collecting Is Required"]
    }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
