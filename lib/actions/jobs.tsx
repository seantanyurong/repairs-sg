"use server";

import Job from "@/models/Job";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import Service from "@/models/Service";

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
  // const scheduleSchema = z.object({
  //   timeStart: z.date(),
  //   timeEnd: z.date(),
  // });

  const formattedSchedule = JSON.parse(job.schedule);

  // const scheduleResponse = scheduleSchema.safeParse({
  //   timeStart: new Date(formattedSchedule.timeStart),
  //   timeEnd: new Date(formattedSchedule.timeEnd),
  // });

  // if (!scheduleResponse.success) {
  //   return {
  //     message: 'Error',
  //     errors: scheduleResponse.error.flatten().fieldErrors,
  //   };
  // }

  // const newSchedule = new Schedule(scheduleResponse.data);
  // newSchedule.save();

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
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const newJob = new Job(response.data);
  newJob.save();

  return { message: "Job booked successfully" };
};

const getJobs = async () => {
  return Job.find();
};

const getJobsWithService = async () => {
  const jobs = await Job.find().populate("service").exec();

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
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const filter = { _id: new ObjectId(response.data._id) };
  const update = { staff: response.data.staff };
  await Job.findOneAndUpdate(filter, update);
  revalidatePath("/staff/schedule");

  return { message: "Job updated successfully" };
};

const getJobsByStaffId = async (staffId: string) => {
  return Job.find({ staff: staffId });
};

const getJobsByCustomerId = async (customerId: string) => {
  return Job.find({ customer: customerId })
    .populate({ path: "service", model: Service })
    .exec();
};

const getFutureJobsByVehicleId = async (vehicleId: string) => {
  return Job.find({
    vehicle: new ObjectId(vehicleId),
    "schedule.timeStart": { $gte: new Date() },
  });
};

const getNumOfCompletedJobInMonthByStaff = async (staffId: string) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const completedJobs = await Job.find({
    staff: staffId,
    status: "Completed",
    "schedule.timeEnd": { $gte: startOfMonth, $lte: endOfMonth },
  });

  return completedJobs.length;
};

export {
  addJob,
  getJobs,
  getJobsWithService,
  updateJobStaff,
  getJobsByStaffId,
  getJobsByCustomerId,
  getFutureJobsByVehicleId,
  getNumOfCompletedJobInMonthByStaff,
};
