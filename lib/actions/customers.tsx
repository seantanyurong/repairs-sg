"use server";

import { z } from "zod";

import Customers from "@/models/Customer";
import { createClerkClient } from "@clerk/nextjs/server";

const customerClerk = createClerkClient({
  secretKey: process.env.CUSTOMER_CLERK_SECRET_KEY as string,
});

const getCustomers = async () => {
  return Customers.find();
};

const getCustomerByEmail = async (email: string) => {
  const result = await customerClerk.users.getUserList({
    emailAddress: [email],
  });

  if (result.totalCount === 0) {
    throw new Error("No customer found with that email address");
  }
  console.log(result.data[0]);

  if (result.data[0].banned) {
    throw new Error("Customer is banned");
  }
  return JSON.stringify(result.data[0]);
};

const getCustomerById = async (id: string) => {
  const user = await customerClerk.users.getUser(id);

  if (!user) throw new Error("No customer found with that id");

  return JSON.stringify(user);
};

const addCustomer = async (customer: {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const customerSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().min(1),
    role: z.enum(["superadmin", "admin", "technician"]),
    phone: z.string()
    // .refine((value) => !value || isValidPhoneNumber(value), {
    //   message: "Invalid phone number",
    // }),
  });

  // const emails = await getAllCustomerEmail();
  // if (emails.includes(customer.email)) {
  //   return {
  //     message: "Error",
  //     errors: {
  //       "Email error": "That email address is taken. Please try another.",
  //     },
  //   };
  // }

  const response = customerSchema.safeParse({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    role: customer.role,
    phone: customer.phone,
  });

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const params = {
    first_name: response.data.firstName,
    last_name: response.data.lastName,
    email_address: [response.data.email],
    // password: response.data.password,
    publicMetadata: {
      role: response.data.role,
    },
    unsafeMetadata: {
      phone: response.data.phone,
    },
  };

  await customerClerk.users.createUser(params);

  return { message: "Customer created successfully" };
};

// TO BE COMPLETED
const deleteCustomer = async (customerId: string) => {
  await customerClerk.users.deleteUser(customerId);
};

// TO BE COMPLETED
const updateCustomer = async (customer: {
  id: string;
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phone?: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const customerSchema = z.object({
    id: z.string().min(1),
    imageUrl: z.string().min(1).optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().min(1).optional(),
    role: z.enum(["superadmin", "admin", "technician"]).optional(),
    phone: z
      .string()
      .optional()
      // .refine((value) => !value || isValidPhoneNumber(value), {
      //   message: "Invalid phone number",
      // }),
  });

  const response = customerSchema.safeParse({
    id: customer.id,
    imageUrl: customer.imageUrl,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    role: customer.role,
    phone: customer.phone,
  });

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const userParams = {
    imageUrl: response.data.imageUrl as string,
    firstName: response.data.firstName,
    lastName: response.data.lastName,
    // password: response.data.password,
  };

  const metadataParams = {
    publicMetadata: {
      role: response.data.role,
    },
    unsafeMetadata: {
      phone: response.data.phone,
    },
  };

  await customerClerk.users.updateUser(customer.id, userParams);
  await customerClerk.users.updateUserMetadata(customer.id, metadataParams);

  return { message: "Customer updated successfully" };
};

export { getCustomers, getCustomerByEmail, getCustomerById, addCustomer, deleteCustomer, updateCustomer };
