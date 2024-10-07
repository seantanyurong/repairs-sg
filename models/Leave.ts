import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["ANNUAL", "MC"],
      required: [true, "Leave Type Is Required"],
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      required: [true, "Leave Status Is Required"],
    },
    dateRange: {
      start: {
        type: Date,
        required: [true, "Start Date Is Required!"],
      },
      end: {
        type: Date,
        required: [true, "End Date Is Required!"],
      },
    },
    requesterId: {
      type: String,
      ref: "Staff",
      required: [true, "Staff ID Is Required"],
    },
    approverId: {
      type: String,
      ref: "Staff",
      required: [true, "Staff ID Is Required"],
    },
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.models.Leave || mongoose.model("Leave", leaveSchema);
