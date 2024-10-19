'use server';

import Job from '@/models/Job';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import Schedule from '@/models/Schedule';

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

  // Create Schedule
  const scheduleSchema = z.object({
    timeStart: z.date(),
    timeEnd: z.date(),
  });

  const formattedSchedule = JSON.parse(job.schedule);

  const scheduleResponse = scheduleSchema.safeParse({
    timeStart: new Date(formattedSchedule.timeStart),
    timeEnd: new Date(formattedSchedule.timeEnd),
  });

  if (!scheduleResponse.success) {
    return {
      message: 'Error',
      errors: scheduleResponse.error.flatten().fieldErrors,
    };
  }

  const newSchedule = new Schedule(scheduleResponse.data);
  newSchedule.save();

  // Create Job
  const jobSchema = z.object({
    quantity: z.number(),
    jobAddress: z.string(),
    schedule: z.instanceof(ObjectId),
    description: z.string(),
    service: z.instanceof(ObjectId),
    customer: z.string(),
  });

  const response = jobSchema.safeParse({
    quantity: job.quantity,
    jobAddress: job.jobAddress,
    schedule: newSchedule._id,
    description: job.description,
    service: new ObjectId(job.serviceId),
    customer: job.customer,
  });

  if (!response.success) {
    return { message: 'Error', errors: response.error.flatten().fieldErrors };
  }

  const newJob = new Job(response.data);
  newJob.save();

  return { message: 'Job booked successfully' };
};

const getJobs = async () => {
  return Job.find();
};

const getJobsForSchedule = async () => {
  const jobs = await Job.find()
  .populate('schedule')
  .populate('service')
  .exec();

  return jobs;
};

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
    return { message: 'Error', errors: response.error.flatten().fieldErrors };
  }

  const filter = { _id: new ObjectId(response.data._id) };
  const update = { staff: response.data.staff };
  await Job.findOneAndUpdate(filter, update);
  revalidatePath('/staff/schedule');

  return { message: 'Job updated successfully' };
}

export { addJob, getJobs, getJobsForSchedule, updateJobStaff };
