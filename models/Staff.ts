import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    // staffId: {
    //     type: Number,
    //     required: [true, "Staff ID Is Required!"],
    //     unique: true
    // },
    // username: {
    //     type: String,
    //     required: [true, "Username Is Required!"],
    //     unique: true,
    //     trim: true,
    //     lowercase: true
    // },
    // email: {
    //     type: String,
    //     required: [true, "Email Is Required"],
    //     unique: true,
    //     trim: true,
    //     lowercase: true,
    //     match: [/^\S+@\S+\.\S+$/, 'Please Provide A Valid Email Address!']
    // },
    // password: {
    //     type: String,
    //     required: [true, "Password Is Required"]
    // },
    fullName: {
        type: String,
        maxlength: [64, 'Full Name Can Have At Most 64 Characters']
    },
    // firstName: {
    //     type: String,
    //     maxlength: [32, 'First Name Can Have At Most 32 Characters']
    // },
    // lastName: {
    //     type: String,
    //     maxlength: [32, 'Last Name Can Have At Most 32 Characters']
    // },
    // status: {
    //     type: String,
    //     required: [true, "Status Is Required!"],
    // }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Staff || mongoose.model('Staff', staffSchema, 'staff');
