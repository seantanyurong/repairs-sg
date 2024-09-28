import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
	categoryType: [{
        type: String,
        enum: ['ELECTRICIAN', 'VENTILATION', 'PLUMBER', 'HANDYMAN', 'AIRCON'],
        required: [true, "Category Type Is Required"]
    }],
	description: {
		type: String,
        maxlength: [500, 'Description Can Have At Most 500 Characters']
	},
    quickQuotation: {
        type: Array
    },
    status: {
        type: String,
        default: "Draft",
        required: [true, "Job Status Is Required!"]
    },
    is_first_job: {
        type: Boolean,
        default: false
    },  
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    jobAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    // removed array for simplicity. will add back
    schedules: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule"
    },
    quotations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quotation"
    }],
    invoices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice"
    }],
	files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: [true, "Created By Is Required!"]
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: [true, "Last Updated By Is Required!"]
    }
}, { versionKey: false, timestamps: true });

export default mongoose.models.Job || mongoose.model('Job', jobSchema);
