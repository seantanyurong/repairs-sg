import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    leaveApplicationId: {
        type: Number,
        required: [true, "Leave Application ID Is Required!"],
        unique: true
    },
    leaveType: {
        type: String,
        enum: ['LEAVE', 'MC', 'OFF'],
        required: [true, "Leave Type Is Required"]
    },
    dateFrom: {
        type: Date,
        required: [true, "Date From Is Required!"]
    },
    dateTo: {
        type: Date,
        required: [true, "Date To Is Required!"]
    },
    takenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: [true, "Staff Is Required"]
    }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Leave || mongoose.model('Leave', leaveSchema);
