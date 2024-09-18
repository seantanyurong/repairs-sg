import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema({
    isArriving: {
        type: Boolean,
        default: false
    },
    hasArrived: {
        type: Boolean,
        default: false
    },
    lateNotificationSent: {
        type: Boolean,
        default: false
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle"
    }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Tracking || mongoose.model('Tracking', trackingSchema);
