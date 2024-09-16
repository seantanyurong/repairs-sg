import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: [true, "Customer Is Required!"]
    },
    fullAddress: {
        type: String,
        required: [true, "Full Address Is Required!"],
        unique: true,
        maxlength: [256, 'Full Address Can Have At Most 256 Characters']
    },
    standardAddress: {
        type: String,
        maxlength: [128, 'Standard Address Can Have At Most 128 Characters']
    },
    shortAddress: {
        type: String,
        maxlength: [64, 'Short Address Can Have At Most 64 Characters']
    },
    countryCode: {
        type: String,
        default: "65",
        required: [true, "Country Code Is Required!"],
        maxlength: [4, 'Country Code Can Have At Most 4 Characters']
    },
    countryName: {
        type: String,
        default: "Singapore",
        required: [true, "Country Name Is Required!"],
        maxlength: [32, 'Country Can Have At Most 32 Characters']
    },
    province: {
        type: String,
        default: "Singapore",
        required: [true, "Province Is Required!"],
        maxlength: [64, 'Province Can Have At Most 64 Characters']
    },
    city: {
        type: String,
        default: "Singapore",
        required: [true, "City Is Required!"],
        maxlength: [64, 'City Can Have At Most 64 Characters']
    },
    roadName: {
        type: String,
        required: [true, "Road Name Is Required"],
        maxlength: [64, 'Road Name Can Have At Most 64 Characters']
    },
    blockNumber: {
        type: String,
        maxlength: [8, 'Block Number Can Have At Most 8 Characters']
    },
    unitNumber: {
        type: String,
        maxlength: [8, 'Unit Number Can Have At Most 8 Characters']
    },
    postalCode: {
        type: String,
        required: [true, "Postal Code Is Required!"],
        minlength: [6, 'Postal Code Must Be At Least 6 Characters'],
        maxlength: [32, 'Postal Code Can Have At Most 6 Characters']
    },
    latitude: {
        type: Number,
        required: [true, "Latitude Is Required!"]
    },
    longitude: {
        type: Number,
        required: [true, "Longitude Is Required!"]
    },
    callingCode: {
        type: String,
        default: "65",
        maxlength: [4, 'Calling Code Can Have At Most 4 Characters']
    },
    phoneNumber: {
        type: String,
        maxlength: [32, 'Phone Number Can Have At Most 32 Characters']
    },
    verified: {
        type: Boolean,
        default: true,
        required: [true, "Verification Status Is Required!"]
    },
    label: {
        type: String
    }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Address || mongoose.model('Address', addressSchema);
