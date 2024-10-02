'use server';

import Customers from '@/models/Customer';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

const getCustomers = async () => {
  return Customers.find();
};

export { getCustomers };
