'use server';

import Address from '@/models/Address';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

const getAddress = async () => {
  return Address.find();
};

export { getAddress };
