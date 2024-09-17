import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    key: {
        type: String,
        required: [true, "File Key Is Required!"],
        maxlength: [64, 'Key Can Have At Most 64 Characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description Can Have At Most 500 Characters']
    },
    type: {
        type: String,
        required: [true, "File Type Is Required"],
        maxlength: [8, 'File Type Can Have At Most 8 Characters']
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
