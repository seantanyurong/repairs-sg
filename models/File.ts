import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    key: {
        type: String,
        required: [true, "File Key Is Required!"]
    },
    description: {
        type: String
    },
    type: {
        type: String,
        required: [true, "File Type Is Required"]
    },
    thumbnail: {
        type: String
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: [true, "Staff Is Required"]
    }
}, { versionKey: false, timestamps: false });

export default mongoose.models.File || mongoose.model('File', fileSchema);
