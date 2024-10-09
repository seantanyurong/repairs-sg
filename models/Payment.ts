import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    paymentDate: {
        type: Date,
        required: [true, "Payment Date Is Required"],
        validate: {
            validator: function (value: Date) {
                return value >= new Date();
            },
            message: "Date Must Be Now/In The Future!"
        }
    },
    amount: {
        type: Number,
        required: [true, "Amount Is Required"],
        min: [0.01, 'Total Amount Must Be Greater Than 0!']
    },
    paymentMethod: {
        type: String,
        enum: ['BANKTRANSFER', 'CASH', 'PAYLAH', 'PAYNOW'],
        required: [true, "Payment Method Is Required"]
    },
    note: {
        type: String,
        maxlength: [500, 'Note Can Have At Most 500 Characters']
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
        required: [true, "Invoice Is Required"]
    },
    collectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
    }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
