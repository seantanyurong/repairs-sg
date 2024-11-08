'use server';

import Job from '@/models/Job';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import Service from '@/models/Service';
import mongoose from 'mongoose';
import Invoice from '@/models/Invoice';

const addJob = async (job: {
  quantity: number;
  jobAddress: string;
  schedule: string;
  description: string;
  price: number;
  serviceId: string;
  customer: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {

  console.log(job);

  const formattedSchedule = JSON.parse(job.schedule);

  // Create Job
  const jobSchema = z.object({
    quantity: z.number(),
    jobAddress: z.string(),
    description: z.string(),
    price: z.number(),
    service: z.instanceof(ObjectId),
    customer: z.string(),
    schedule: z.object({
      timeStart: z.date(),
      timeEnd: z.date(),
    }),
  });

  const response = jobSchema.safeParse({
    quantity: job.quantity,
    jobAddress: job.jobAddress,
    description: job.description,
    price: job.price,
    service: new ObjectId(job.serviceId),
    customer: job.customer,
    schedule: {
      timeStart: new Date(formattedSchedule.timeStart),
      timeEnd: new Date(formattedSchedule.timeEnd),
    },
  });

  if (!response.success) {
    return { message: 'Error', errors: response.error.flatten().fieldErrors };
  }

  const newJob = new Job(response.data);
  newJob.save();

  return { message: 'Job booked successfully' };
};

const fieldFriendlyNames: Record<string, string> = {
  quantity: "Quantity",
  jobAddress: "Job Address",
  description: "Description",
  price: "Price",
  service: "Service",
  customer: "Customer",
  schedule: "Schedule",
  staff: "Staff",
};

const updateJob = async (job: {
  _id: string;
  quantity: number;
  jobAddress: string;
  schedule: string;
  description: string;
  price: number;
  serviceId: string;
  customer: string;
  staff: string;
  vehicle: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {

  console.log("updateJob")
  console.log(job);

  const formattedSchedule = JSON.parse(job.schedule);

  const jobSchema = z.object({
    _id: z.string().min(1),
    quantity: z.number(),
    jobAddress: z.string(),
    description: z.string(),
    price: z.number(),
    service: z.instanceof(ObjectId),
    customer: z.string(),
    schedule: z.object({
      timeStart: z.date(),
      timeEnd: z.date(),
    }),
    staff: z.string(),
    vehicle: z.instanceof(ObjectId).nullable(),
  });

  const response = jobSchema.safeParse({
    _id: job._id,
    quantity: job.quantity,
    jobAddress: job.jobAddress,
    description: job.description,
    price: job.price,
    service: new ObjectId(job.serviceId),
    customer: job.customer,
    schedule: {
      timeStart: new Date(formattedSchedule.timeStart),
      timeEnd: new Date(formattedSchedule.timeEnd),
    },
    staff: job.staff,
    vehicle: job.vehicle === '' ? null :new ObjectId(job.vehicle),
  });

  if (!response.success) {
    return { message: 'Error', errors: response.error.flatten().fieldErrors };
  }

  const filter = { _id: new ObjectId(response.data._id) };
  const update = { quantity: response.data.quantity, jobAddress: response.data.jobAddress, description: response.data.description, price: response.data.price, service: response.data.service, customer: response.data.customer, schedule: response.data.schedule, staff: response.data.staff, vehicle: response.data.vehicle };
  const context = { runValidators: true, context: 'query' };

  try {
    await Job.findOneAndUpdate(filter, update, context);
    revalidatePath('/staff/schedule');
    return { message: 'Job updated successfully' };
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError && error.errors) {
      // Mongoose validation errors (including unique-validator errors)
      const mongooseErrors = Object.keys(error.errors).reduce((acc, key) => {
        const friendlyKey = fieldFriendlyNames[key] || key; // Map to friendly name if available
        const errorMessage = error.errors[key].message.replace(key, friendlyKey); // Replace field name in the message
        acc[friendlyKey] = [errorMessage]; // Structure as an array to match Zod format
        return acc;
      }, {} as Record<string, string[]>);

      return { message: 'Validation error', errors: mongooseErrors };
    }

    // Handle other types of errors (optional)
    return { message: 'An unexpected error occurred' };
  }
};

const deleteJob = async (jobId: string): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {

  // voids related invoices
  for (const invoice of await Invoice.find({ job: jobId })) {
    await Invoice.findByIdAndUpdate(invoice._id, { validityStatus: "void" });
  }
  // deletes job
  await Job.findByIdAndDelete(jobId);
  revalidatePath('/staff/schedule');
  return { message: 'Job deleted successfully' };
}

const getJobs = async () => {
  return Job.find();
};

const getJobsWithServiceAndVehicle = async () => {
  const jobs = await Job.find().populate("service").populate("vehicle").exec();

  return jobs;
};

const getSingleJob = async (
  jobId: string
) => {
  const job = await Job.findById(jobId)
  .populate("service")
  .populate("customer")
  .populate("staff")
  .populate("vehicle")
  .exec();
  return job;
}

const updateJobStaff = async (
  _id: string,
  staff: string,
): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const jobSchema = z.object({
    _id: z.string().min(1),
    staff: z.string().min(1),
  });

  const response = jobSchema.safeParse({
    _id: _id,
    staff: staff,
  });

  if (!response.success) {
    return { message: 'Error', errors: response.error.flatten().fieldErrors };
  }

  const filter = { _id: new ObjectId(response.data._id) };
  const update = { staff: response.data.staff };
  await Job.findOneAndUpdate(filter, update);
  revalidatePath('/staff/schedule');

  return { message: 'Job updated successfully' };
};

const updateJobVehicle = async (
  _id: string,
  vehicle: string
): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const jobVehicleSchema = z.object({
    _id: z.string().min(1),
    vehicle: z.instanceof(ObjectId),
  });
  

  const response = jobVehicleSchema.safeParse({
    _id: _id,
    vehicle: new ObjectId(vehicle),
  });

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const filter = { _id: new ObjectId(response.data._id) };
  const update = { vehicle: response.data.vehicle };
  await Job.findOneAndUpdate(filter, update);
  revalidatePath("/staff/schedule");

  return { message: "Job updated successfully" };
};

const updateJobStatus = async (
  _id: string,
  status: string
): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const jobStatusSchema = z.object({
    _id: z.string().min(1),
    status: z.string().min(1),
  });
  

  const response = jobStatusSchema.safeParse({
    _id: _id,
    status: status,
  });

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const filter = { _id: new ObjectId(response.data._id) };
  const update = { status: response.data.status };
  await Job.findOneAndUpdate(filter, update);
  revalidatePath("/staff/schedule");

  return { message: "Job updated successfully" };
};

const getJobsByStaffId = async (staffId: string) => {
  return Job.find({ staff: staffId });
};

const getJobsByCustomerId = async (customerId: string) => {
  return Job.find({ customer: customerId }).populate({ path: 'service', model: Service }).exec();
};

const getFutureJobsByVehicleId = async (vehicleId: string) => {
  return Job.find({
    vehicle: new ObjectId(vehicleId),
    'schedule.timeStart': { $gte: new Date() },
  });
};

export {
  addJob,
  getJobs,
  getJobsWithServiceAndVehicle,
  updateJobStaff,
  getJobsByStaffId,
  getJobsByCustomerId,
  getFutureJobsByVehicleId,
  updateJobVehicle,
  updateJobStatus,
  updateJob,
  getSingleJob,
  deleteJob
};
