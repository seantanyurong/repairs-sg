'use server';

import Vehicle from '@/models/Vehicle';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

const addVehicle = async (vehicle: {
  licencePlate: string;
  gpsApi: string;
  make: string;
  model: string;
  status: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const vehicleSchema = z.object({
    licencePlate: z.string().min(1),
    gpsApi: z.string().min(1),
    make: z.string().min(1),
    model: z.string().min(1),
    status: z.enum(['Draft', 'Active', 'Disabled']),
  });

  const response = vehicleSchema.safeParse({
    licencePlate: vehicle.licencePlate,
    gpsApi: vehicle.gpsApi,
    make: vehicle.make,
    model: vehicle.model,
    status: vehicle.status,
  });

  if (!response.success) {
    return { message: 'Error', errors: response.error.flatten().fieldErrors };
  }

  const newVehicle = new Vehicle(response.data);
  newVehicle.save();

  return { message: 'Vehicle added successfully' };
};

const updateVehicle = async (vehicle: {
  _id: string;
  licencePlate: string;
  gpsApi: string;
  make: string;
  model: string;
  status: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const vehicleSchema = z.object({
    _id: z.string().min(1),
    licencePlate: z.string().min(1),
    gpsApi: z.string().min(1),
    make: z.string(),
    model: z.string(),
    status: z.enum(['Draft', 'Active', 'Disabled']),
  });

  const response = vehicleSchema.safeParse({
    _id: vehicle._id,
    licencePlate: vehicle.licencePlate,
    gpsApi: vehicle.gpsApi,
    make: vehicle.make,
    model: vehicle.model,
    status: vehicle.status,
  });

  if (!response.success) {
    return { message: 'Error', errors: response.error.flatten().fieldErrors };
  }

  const filter = { _id: new ObjectId(response.data._id) };
  const update = { licencePlate: response.data.licencePlate, gpsApi: response.data.gpsApi, make: response.data.make, model: response.data.model, status: response.data.status };
  await Vehicle.findOneAndUpdate(filter, update);
  revalidatePath('/staff/vehicles');

  return { message: 'Vehicle updated successfully' };
};

const deleteVehicle = async (vehicleId: string) => {
  await Vehicle.findByIdAndDelete(vehicleId);
  revalidatePath('/staff/vehicles');
};

const getVehicle = async (vehicleId: string) => {
  return Vehicle.findById(vehicleId);
};

const getVehicles = async () => {
  return Vehicle.find();
};

export { addVehicle, updateVehicle, deleteVehicle, getVehicle, getVehicles };
