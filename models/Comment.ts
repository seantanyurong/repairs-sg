import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    comment: {
        type: String
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: [true, "Staff Is Required"]
    },
    file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Comment || mongoose.model('Comment', commentSchema);
