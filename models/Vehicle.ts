import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    licencePlate: {
        type: String,
        required: [true, "Licence Plate Is Required!"],
        unique: true
    },
    gpsApi: {
        type: String,
        required: [true, "GPS API Is Required!"],
        unique: true
    },
    make: {
        type: String,
        maxlength: [32, 'Make Can Have At Most 32 Characters']
    },
    model: {
        type: String,
        maxlength: [32, 'Model Can Have At Most 32 Characters']
    },
    status: {
        type: String,
        enum: ['Draft', 'Active', 'Disabled'],
        default: 'Draft',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
