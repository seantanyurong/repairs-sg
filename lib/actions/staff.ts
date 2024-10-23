"use server";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

const staffClerk = clerkClient();

const addStaff = async (staff: {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  password: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const staffSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().min(1),
    role: z.enum(["superadmin", "admin", "technician"]),
    phone: z.string(),
    password: z.string().min(8),
  });

  const emails = await getAllStaffEmail();
  if (emails.includes(staff.email)) {
    return {
      message: "Error",
      errors: {
        "Email error": "That email address is taken. Please try another.",
      },
    };
  }

  const response = staffSchema.safeParse({
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    role: staff.role,
    phone: staff.phone,
    password: staff.password,
  });

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const params = {
    first_name: response.data.firstName,
    last_name: response.data.lastName,
    email_address: [response.data.email],
    password: response.data.password,
    publicMetadata: {
      role: response.data.role,
    },
    unsafeMetadata: {
      phone: response.data.phone,
    },
  };

  await clerkClient().users.createUser(params);

  return { message: "Staff created successfully" };
};

const updateStaff = async (staff: {
  id: string;
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phone?: string;
  password?: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const staffSchema = z.object({
    id: z.string().min(1),
    imageUrl: z.string().min(1).optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().min(1).optional(),
    role: z.enum(["superadmin", "admin", "technician"]).optional(),
    phone: z.string().optional(),
    password: z.string().min(8).optional(),
  });

  const response = staffSchema.safeParse({
    id: staff.id,
    imageUrl: staff.imageUrl,
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    role: staff.role,
    phone: staff.phone,
    password: staff.password,
  });

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const userParams = {
    imageUrl: response.data.imageUrl as string,
    firstName: response.data.firstName,
    lastName: response.data.lastName,
    password: response.data.password,
  };

  const metadataParams = {
    publicMetadata: {
      role: response.data.role,
    },
    unsafeMetadata: {
      phone: response.data.phone,
    },
  };

  await clerkClient().users.updateUser(staff.id, userParams);
  await clerkClient().users.updateUserMetadata(staff.id, metadataParams);

  return { message: "Staff updated successfully" };
};

const getAllStaffEmail = async () => {
  return (await clerkClient().users.getUserList()).data.map(
    (staff) => staff.emailAddresses[0].emailAddress
  );
};

const deleteStaff = async (staffId: string) => {
  await clerkClient().users.deleteUser(staffId);
};

const getStaffById = async (id: string) => {
  const user = await staffClerk.users.getUser(id);

  if (!user) throw new Error("No staff found with that id");

  return JSON.stringify(user);
}

export { addStaff, updateStaff, getAllStaffEmail, deleteStaff, getStaffById };
