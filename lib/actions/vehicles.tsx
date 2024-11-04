"use server";

import Vehicle from "@/models/Vehicle";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { getFutureJobsByVehicleId } from "./jobs";

const fieldFriendlyNames: Record<string, string> = {
  licencePlate: "Licence Plate",
  gpsApi: "GPS API",
  make: "Make",
  model: "Model",
  status: "Status",
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
    status: z.enum(["Draft", "Active", "Disabled"]),
  });

  const response = vehicleSchema.safeParse({
    licencePlate: vehicle.licencePlate,
    gpsApi: vehicle.gpsApi,
    make: vehicle.make,
    model: vehicle.model,
    status: vehicle.status,
  });

  if (!response.success) {
    return { message: "", errors: response.error.flatten().fieldErrors };
  }

  try {
    const newVehicle = new Vehicle(response.data);
    await newVehicle.save();

    return { message: "Vehicle added successfully" };
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError && error.errors) {
      // Mongoose validation errors (including unique-validator errors)
      const mongooseErrors = Object.keys(error.errors).reduce(
        (acc, key) => {
          const friendlyKey = fieldFriendlyNames[key] || key; // Map to friendly name if available
          const errorMessage = error.errors[key].message.replace(
            key,
            friendlyKey
          ); // Replace field name in the message
          acc[friendlyKey] = [errorMessage]; // Structure as an array to match Zod format
          return acc;
        },
        {} as Record<string, string[]>
      );

      return { message: "Validation error", errors: mongooseErrors };
    }

    return { message: "An unexpected error occurred" };
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
    status: z.enum(["Draft", "Active", "Disabled"]),
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
    return { message: "", errors: response.error.flatten().fieldErrors };
  }

  const filter = { _id: new ObjectId(response.data._id) };
  const update = {
    licencePlate: response.data.licencePlate,
    gpsApi: response.data.gpsApi,
    make: response.data.make,
    model: response.data.model,
    status: response.data.status,
  };
  const context = { runValidators: true, context: "query" };

  // if marking as inactive
  // check for future jobs that use this vehicle
  if (update.status === "Disabled") {
    const futureJobs = await getFutureJobsByVehicleId(vehicle._id);
    if (futureJobs.length > 0) {
      return {
        message: "Vehicle is being used in a future job.",
        errors: {
          status: [
            "Jobs must be reassigned before vehicle can be marked inactive",
          ],
        },
      };
    }
  }

  try {
    await Vehicle.findOneAndUpdate(filter, update, context);
    revalidatePath("/staff/vehicles");
    return { message: "Vehicle updated successfully" };
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError && error.errors) {
      // Mongoose validation errors (including unique-validator errors)
      const mongooseErrors = Object.keys(error.errors).reduce(
        (acc, key) => {
          const friendlyKey = fieldFriendlyNames[key] || key; // Map to friendly name if available
          const errorMessage = error.errors[key].message.replace(
            key,
            friendlyKey
          ); // Replace field name in the message
          acc[friendlyKey] = [errorMessage]; // Structure as an array to match Zod format
          return acc;
        },
        {} as Record<string, string[]>
      );

      return { message: "Validation error", errors: mongooseErrors };
    }

    // Handle other types of errors (optional)
    return { message: "An unexpected error occurred" };
  }
};

const deleteVehicle = async (vehicleId: string) => {
  const futureJobs = await getFutureJobsByVehicleId(vehicleId);
  if (futureJobs.length > 0) {
    throw new Error(
      "Vehicle is being used in a future job. Job must be reassigned before vehicle can be deleted."
    );
  }
  await Vehicle.findByIdAndDelete(vehicleId);
  revalidatePath("/staff/vehicles");
};

const getVehicle = async (vehicleId: string) => {
  return Vehicle.findById(vehicleId);
};

const getVehicles = async () => {
  return Vehicle.find();
};

export { addVehicle, updateVehicle, deleteVehicle, getVehicle, getVehicles };
