'use server';

import Staff from '@/models/Staff';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

const getStaff = async () => {
  return Staff.find();
};

export { getStaff };
