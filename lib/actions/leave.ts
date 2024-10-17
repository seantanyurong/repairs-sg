"use server";

import { z } from "zod";
import { ObjectId } from "mongodb";
import Leave from "@/models/Leave";
import { revalidatePath } from "next/cache";

const addLeave = async (leave: {
  type: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
  requesterId: string;
  approverId: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const leaveSchema = z.object({
    type: z.enum(["ANNUAL", "MC"]),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    dateRange: z.object({
      start: z.string().min(1),
      end: z.string().min(1),
    }),
    requesterId: z.string().min(1),
    approverId: z.string().min(1),
  });

  const response = leaveSchema.safeParse({
    type: leave.type,
    status: leave.status,
    dateRange: {
      start: leave.dateRange.start,
      end: leave.dateRange.end,
    },
    requesterId: leave.requesterId,
    approverId: leave.approverId,
  });

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const newLeave = new Leave(response.data);
  newLeave.save();

  return { message: "Leave request applied successfully" };
};

const updateLeave = async (leave: {
  _id: string;
  type?: string;
  status?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
  requesterId?: string;
  approverId?: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const leaveSchema = z.object({
    _id: z.string().min(1),
    type: z.enum(["ANNUAL", "MC"]).optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    dateRange: z
      .object({
        start: z.string().min(1).optional(),
        end: z.string().min(1).optional(),
      })
      .optional(),
    requesterId: z.string().min(1).optional(),
    approverId: z.string().min(1).optional(),
  });

  const response = leaveSchema.safeParse({
    _id: leave._id,
    type: leave.type,
    status: leave.status,
    dateRange: {
      start: leave.dateRange?.start,
      end: leave.dateRange?.end,
    },
    requesterId: leave.requesterId,
    approverId: leave.approverId,
  });

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const filter = { _id: new ObjectId(response.data._id) };
  const update = {
    _id: response.data._id,
    type: response.data.type,
    status: response.data.status,
    dateRange: {
      start: response.data.dateRange?.start,
      end: response.data.dateRange?.end,
    },
    requesterId: response.data.requesterId,
    approverId: response.data.approverId,
  };
  await Leave.findOneAndUpdate(filter, update);
  revalidatePath("/staff/leaves");

  return { message: "Leave request updated successfully" };
};

const deleteLeave = async (leaveId: string) => {
  await Leave.findByIdAndDelete(leaveId);
};

const getLeave = async (leaveId: string) => {
  return Leave.findById(leaveId);
};

const getLeaves = async () => {
  return Leave.find();
};

const getLeavesByRequesterId = async (requesterId: string) => {
  return Leave.find({ requesterId: requesterId });
};

const getLeavesByApproverId = async (approverId: string) => {
  return Leave.find({ approverId: approverId });
};


export {
  addLeave,
  updateLeave,
  deleteLeave,
  getLeave,
  getLeaves,
  getLeavesByRequesterId,
  getLeavesByApproverId
};
