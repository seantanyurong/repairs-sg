'use server';

import Schedule from '@/models/Schedule';

const getSchedules = async () => {
  return Schedule.find();
};

const getSchedulesWithStaff = async () => {
  const schedules = await Schedule.find()
    .populate('teamMembers')
    .exec();
  
  return schedules;
};

export { getSchedules, getSchedulesWithStaff };
