"use server";

import Job from '@/models/Job';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

const addJob = async (job: {
  quantity: number;
  jobAddress: string;
  schedule: string;
  description: string;
  serviceId: string;
  price: number;
  customer: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {

  // Add price to description
  job.description += `\n\nPrice: $${job.price}`;

  const formattedSchedule = JSON.parse(job.schedule);

  // Create Job
  const jobSchema = z.object({
    quantity: z.number(),
    jobAddress: z.string(),
    description: z.string(),
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

const saveJob = async (job: {
  quantity: number;
  jobAddress: string;
  schedule: string;
  description: string;
  serviceId: string;
  price: number;
  customer: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {

  // Add price to description
  job.description += `\n\nPrice: $${job.price}`;

  const formattedSchedule = JSON.parse(job.schedule);

  // Create Job
  const jobSchema = z.object({
    quantity: z.number(),
    jobAddress: z.string(),
    description: z.string(),
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

  return { message: 'Job updated successfully' };
};

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
  .exec();
  return job;
}

const updateJobStaff = async (
  _id: string,
  staff: string
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
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const filter = { _id: new ObjectId(response.data._id) };
  const update = { staff: response.data.staff };
  await Job.findOneAndUpdate(filter, update);
  revalidatePath("/staff/schedule");

  return { message: "Job updated successfully" };
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

const getJobsByStaffId = async (staffId: string) => {
  return Job.find({ staff: staffId });
};

export { addJob, getJobs, getJobsWithServiceAndVehicle, updateJobStaff, updateJobVehicle, getJobsByStaffId, getSingleJob };
