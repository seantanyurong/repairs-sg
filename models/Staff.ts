import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    staffId: {
        type: Number,
        required: [true, "Staff ID Is Required!"],
        unique: true
    },
    username: {
        type: String,
        required: [true, "Username Is Required!"],
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "Email Is Required"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password Is Required"]
    },
    fullName: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    status: {
        type: String
    }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Staff || mongoose.model('Staff', staffSchema);
