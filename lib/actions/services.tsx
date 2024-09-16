'use server';

import Service from '@/models/Service';
import { z } from 'zod';

const addService = async (service: {
  name: string;
  description: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const serviceSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
  });

  const response = serviceSchema.safeParse({
    name: service.name,
    description: service.description,
  });

  if (!response.success) {
    return { message: 'Error', errors: response.error.flatten().fieldErrors };
  }

  console.log(response.data);

  const newService = new Service(response.data);
  newService.save();

  return { message: 'Service added successfully' };
};

const getServices = async () => {
  return Service.find();
};

export { addService, getServices };
