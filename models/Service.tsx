import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: [32, 'First Name Can Have At Most 32 Characters'],
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
