import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    vehicleId: {
        type: Number,
        required: [true, "Vehicle ID Is Required!"],
        unique: true
    },
    licensePlate: {
        type: String,
        required: [true, "License Plate Is Required!"],
        unique: true
    },
    model: {
        type: String,
        maxlength: [32, 'Model Can Have At Most 32 Characters']
    },
    make: {
        type: String,
        maxlength: [32, 'Make Can Have At Most 32 Characters']
    }
}, { versionKey: false, timestamps: false });

export default mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
