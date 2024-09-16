import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    customerId: {
        type: Number,
        required: [true, "Customer ID Is Required!"],
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
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    fullNameWithCompany: {
        type: String,
    },
    companyName: {
        type: String
    },
    callingCode: {
        type: String,
        default: '65',
    },
    phone: {
        type: String
    },
    notes: {
        type: Array
    },
    activityStatus: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        required: [true, "Activity Status Is Required!"]
    },
    isBlacklisted: {
        type: Boolean,
        default: false,
        required: [true, "Blacklisted Status Is Required!"]
    },
    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: [true, "Addresses Are Required!"]
    }],
    defaultBillingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: [true, "Default Billing Address Is Required!"]
    },
    defaultJobAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: [true, "Default Job Address Is Required!"]
    }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema);
