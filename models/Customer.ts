import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    // username: {
    //     type: String,
    //     required: [true, "Username Is Required!"],
    //     unique: true,
    //     trim: true,
    //     lowercase: true
    // },
    // email: {
    //     type: String,
    //     required: [true, "Email Is Required!"],
    //     unique: true,
    //     trim: true,
    //     lowercase: true,
    //     match: [/^\S+@\S+\.\S+$/, 'Please Provide A Valid Email Address!']
    // },
    // password: {
    //     type: String,
    //     required: [true, "Password Is Required!"]
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
    // fullNameWithCompany: {
    //     type: String,
    //     maxlength: [128, 'Full Name With Company Can Have At Most 128 Characters']
    // },
    // companyName: {
    //     type: String,
    //     maxlength: [64, 'Company Name Can Have At Most 64 Characters']
    // },
    // callingCode: {
    //     type: String,
    //     default: '65',
    //     maxlength: [4, 'Calling Code Can Have At Most 4 Characters']
    // },
    // phoneNumber: {
    //     type: String,
    //     maxlength: [16, 'Phone Number Can Have At Most 16 Characters']
    // },
    // notes: {
    //     type: Array
    // },
    // activityStatus: {
    //     type: String,
    //     enum: ['ACTIVE', 'INACTIVE'],
    //     required: [true, "Activity Status Is Required!"]
    // },
    // isBlacklisted: {
    //     type: Boolean,
    //     default: false,
    //     required: [true, "Blacklisted Status Is Required!"]
    // },
    // addresses: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Address',
    //     required: [true, "Addresses Are Required!"]
    // }],
    // defaultBillingAddress: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Address',
    //     required: [true, "Default Billing Address Is Required!"]
    // },
    // defaultJobAddress: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Address',
    //     required: [true, "Default Job Address Is Required!"]
    // }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema);
