import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: [32, 'First Name Can Have At Most 32 Characters'],
    },
    description: {
      type: String,
      maxlength: [255, 'Description Can Have At Most 255 Characters'],
    },
    price: {
      type: Number,
      required: [true, 'Amount Is Required'],
    },
    volumeDiscountPercentage: {
      type: Number,
      required: [true, 'Amount Is Required'],
    },
    status: {
      type: String,
      enum: ['Draft', 'Active', 'Disabled'],
      default: 'Draft',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, timestamps: true },
);

export default mongoose.models.Service || mongoose.model('Service', serviceSchema);