'use server';

import Schedule from '@/models/Schedule';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

const getSchedules = async () => {
  return Schedule.find();
};

export { getSchedules };
