'use server';

import Vehicle from '@/models/Vehicle';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

const fieldFriendlyNames: Record<string, string> = {
  licencePlate: 'Licence Plate',
  gpsApi: 'GPS API',
  make: 'Make',
  model: 'Model',
  status: 'Status',
};

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
    return { message: '', errors: response.error.flatten().fieldErrors };
  }

  try {
    const newVehicle = new Vehicle(response.data);
    await newVehicle.save();

    return { message: 'Vehicle added successfully' };
  } catch (error: any) {
    if (error.name === 'ValidationError' && error.errors) {
      // Mongoose validation errors (including unique-validator errors)
      const mongooseErrors = Object.keys(error.errors).reduce((acc, key) => {
        const friendlyKey = fieldFriendlyNames[key] || key; // Map to friendly name if available
        const errorMessage = error.errors[key].message.replace(key, friendlyKey); // Replace field name in the message
        acc[friendlyKey] = [errorMessage]; // Structure as an array to match Zod format
        return acc;
      }, {} as Record<string, string[]>);

      return { message: 'Validation error', errors: mongooseErrors };
    }

    // Handle other types of errors (optional)
    return { message: 'An unexpected error occurred', errors: error.message };
  }
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
    return { message: '', errors: response.error.flatten().fieldErrors };
  }

  const filter = { _id: new ObjectId(response.data._id) };
  const update = { licencePlate: response.data.licencePlate, gpsApi: response.data.gpsApi, make: response.data.make, model: response.data.model, status: response.data.status };
  const context = { runValidators: true, context: 'query' };

  try {
    await Vehicle.findOneAndUpdate(filter, update, context);
    revalidatePath('/staff/vehicles');
    return { message: 'Vehicle updated successfully' };
  } catch (error: any) {
    if (error.name === 'ValidationError' && error.errors) {
      // Mongoose validation errors (including unique-validator errors)
      const mongooseErrors = Object.keys(error.errors).reduce((acc, key) => {
        const friendlyKey = fieldFriendlyNames[key] || key; // Map to friendly name if available
        const errorMessage = error.errors[key].message.replace(key, friendlyKey); // Replace field name in the message
        acc[friendlyKey] = [errorMessage]; // Structure as an array to match Zod format
        return acc;
      }, {} as Record<string, string[]>);

      return { message: 'Validation error', errors: mongooseErrors };
    }

    // Handle other types of errors (optional)
    return { message: 'An unexpected error occurred', errors: error.message };
  }

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
