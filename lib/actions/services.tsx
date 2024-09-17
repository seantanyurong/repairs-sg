'use server';

import Service from '@/models/Service';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const addService = async (service: {
  name: string;
  description: string;
  status: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const serviceSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    status: z.enum(['Draft', 'Active', 'Disabled']),
  });

  const response = serviceSchema.safeParse({
    name: service.name,
    description: service.description,
    status: service.status,
  });

  if (!response.success) {
    return { message: 'Error', errors: response.error.flatten().fieldErrors };
  }

  const newService = new Service(response.data);
  newService.save();

  return { message: 'Service added successfully' };
};

const deleteService = async (serviceId: string) => {
  await Service.findByIdAndDelete(serviceId);

  // Revalidate the home page to remove the deleted post
  revalidatePath('/staff/services');
};

const getServices = async () => {
  return Service.find();
};

export { addService, deleteService, getServices };
