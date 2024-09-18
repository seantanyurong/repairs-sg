'use server';

import Service from '@/models/Service';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

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

const updateService = async (service: {
  _id: string;
  name: string;
  description: string;
  status: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const serviceSchema = z.object({
    _id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    status: z.enum(['Draft', 'Active', 'Disabled']),
  });

  const response = serviceSchema.safeParse({
    _id: service._id,
    name: service.name,
    description: service.description,
    status: service.status,
  });

  if (!response.success) {
    return { message: 'Error', errors: response.error.flatten().fieldErrors };
  }

  const filter = { _id: new ObjectId(response.data._id) };
  const update = { name: response.data.name, description: response.data.description, status: response.data.status };
  await Service.findOneAndUpdate(filter, update);
  revalidatePath('/staff/services');

  return { message: 'Service updated successfully' };
};

const deleteService = async (serviceId: string) => {
  await Service.findByIdAndDelete(serviceId);
  revalidatePath('/staff/services');
};

const getService = async (serviceId: string) => {
  return Service.findById(serviceId);
};

const getServices = async () => {
  return Service.find();
};

export { addService, updateService, deleteService, getService, getServices };
