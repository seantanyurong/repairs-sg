import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      maxlength: [500, 'Description Can Have At Most 500 Characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity Is Required!'],
      min: [1, 'Quantity Must Be Greater Than 1'],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    is_first_job: {
      type: Boolean,
      default: false,
    },
    quickQuotation: {
      type: Array,
    },
    quotations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quotation',
      },
    ],
    invoices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
      },
    ],
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
    jobAddress: {
      type: String,
      required: [true, 'Job Address Is Required!'],
      maxlength: [256, 'Job Address Can Have At Most 256 Characters'],
    },
    customer: {
      type: String,
      required: [true, 'Customer Is Required!'],
    },
    status: {
      type: String,
      default: 'Draft',
      required: [true, 'Job Status Is Required!'],
    },
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
    },
    staff: {
      type: String,
    },
    
  },
  { versionKey: false, timestamps: true },
);

export default mongoose.models.Job || mongoose.model('Job', jobSchema);