import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    rewardCode: {
      type: String,
      required: [true, "Reward Code Is Required!"],
      unique: true,
    },
    userId: {
      type: String,
      ref: "Customer",
      required: [true, "User ID Is Required"],
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CLAIMED", "EXPIRED"],
      required: [true, "Reward Status Is Required"],
      default: "ACTIVE",
    },
    type: {
      type: String,
      enum: ["REFERRAL"],
      required: [true, "Reward Type Is Required"],
      default: "REFERRAL",
    },
    amount: {
      type: Number,
      required: [true, "Reward Amount Is Required"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry Date Is Required!"],
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.models.Reward || mongoose.model("Reward", rewardSchema);
