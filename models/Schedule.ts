import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    timeStart: {
        type: Date,
        required: [true, "Start Time Is Required!"]
    },
    timeEnd: {
        type: Date,
        required: [true, "End Time Is Required"]
    },
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff"
    }]
}, { versionKey: false, timestamps: false });

export default mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);
