import mongoose from "mongoose";

const acceptanceSchema = new mongoose.Schema({
    isAccepted: {
        type: Boolean,
        required: [true, "Acceptance Is Required!"]
    },
    signature: {
        type: String,
        required: [true, "Signature Is Required!"]
    },
    firstName: {
        type: String,
        maxlength: [32, 'First Name Can Have At Most 32 Characters']
    },
    lastName: {
        type: String,
        maxlength: [32, 'Last Name Can Have At Most 32 Characters']
    },
    phoneNumber: {
        type: String,
        maxlength: [32, 'Phone Number Can Have At Most 32 Characters']
    },
    email: {
        type: String,
        required: [true, "Email Is Required!"],
        maxlength: [64, 'Email Can Have At Most 64 Characters'],
        match: [/^\S+@\S+\.\S+$/, 'Please Provide A Valid Email Address!']
    },
    message: {
        type: String,
        maxlength: [500, 'Message Can Have At Most 500 Characters']
    }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Acceptance || mongoose.model('Acceptance', acceptanceSchema);
