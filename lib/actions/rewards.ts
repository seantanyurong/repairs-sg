"use server";

import Reward from "@/models/Reward";
import { z } from "zod";
// import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

const addReward = async (reward: {
  rewardCode: string;
  userId: string;
  status: string;
  type: string;
  amount: number;
  expiryDate: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const rewardSchema = z.object({
    rewardCode: z.string().min(1),
    userId: z.string().min(1),
    status: z.enum(["ACTIVE", "CLAIMED", "EXPIRED"]),
    type: z.enum(["REFERRAL"]),
    amount: z.number(),
    expiryDate: z.string(),
  });

  const response = rewardSchema.safeParse({
    rewardCode: reward.rewardCode,
    userId: reward.userId,
    status: reward.status,
    type: reward.type,
    amount: reward.amount,
    expiryDate: reward.expiryDate,
  });

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const newReward = new Reward(response.data);
  newReward.save();

  return { message: "Reward added successfully" };
};

const updateReward = async (reward: {
  _id: string;
  rewardCode: string;
  userId: string;
  status: string;
  type: string;
  amount: number;
  expiryDate: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const rewardSchema = z.object({
    _id: z.string().min(1),
    rewardCode: z.string().min(1),
    userId: z.string().min(1),
    status: z.enum(["ACTIVE", "CLAIMED", "EXPIRED"]),
    type: z.enum(["REFERRAL"]),
    amount: z.number(),
    expiryDate: z.string(),
  });

  const response = rewardSchema.safeParse({
    _id: reward._id,
    rewardCode: reward.rewardCode,
    userId: reward.userId,
    status: reward.status,
    type: reward.type,
    amount: reward.amount,
    expiryDate: reward.expiryDate,
  });

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const filter = { _id: new ObjectId(response.data._id) };
  const update = {
    rewardCode: response.data.rewardCode,
    status: response.data.status,
    userId: response.data.userId,
    type: response.data.type,
    amount: response.data.amount,
    expiryDate: response.data.expiryDate,
  };
  await Reward.findOneAndUpdate(filter, update);
  // revalidatePath("/staff/services");

  return { message: "Reward updated successfully" };
};

const deleteReward = async (rewardId: string) => {
  await Reward.findByIdAndDelete(rewardId);
  // revalidatePath("/staff/services");
};

const getReward = async (rewardId: string) => {
  return Reward.findById(rewardId);
};

const getRewards = async () => {
  return Reward.find();
};

const getRewardsByUserId = async (userId: string) => {
  return Reward.find({ userId: userId });
};

export {
  addReward,
  updateReward,
  deleteReward,
  getReward,
  getRewards,
  getRewardsByUserId,
};
