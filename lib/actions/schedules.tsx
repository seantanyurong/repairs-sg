"use server";

import Schedule from "@/models/Schedule";

const getSchedules = async () => {
  return Schedule.find();
};

const getSchedule = async (scheduleId: string) => {
  return Schedule.findById(scheduleId);
};

const getSchedulesWithStaff = async () => {
  const schedules = await Schedule.find().populate("teamMembers").exec();

  return schedules;
};

export { getSchedules, getSchedule, getSchedulesWithStaff };
