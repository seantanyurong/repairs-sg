"use server";

import { z } from "zod";

import { createClerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const customerClerk = createClerkClient({
  secretKey: process.env.CUSTOMER_CLERK_SECRET_KEY as string,
});

const getCustomers = async () => {
  return await customerClerk.users.getUserList();
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

const getAllCustomerEmail = async () => {
  return (await customerClerk.users.getUserList()).data.map(
    (customer) => customer.emailAddresses[0].emailAddress
  );
};

const addCustomer = async (customer: {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  password: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const customerSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().min(1),
    status: z.enum(["whitelisted", "blacklisted"]),
    password: z.string().min(8),
  });

  const emails = await getAllCustomerEmail();
  if (emails.includes(customer.email)) {
    return {
      message: "Error",
      errors: {
        "Email error": "That email address is taken. Please try another.",
      },
    };
  }

  const response = customerSchema.safeParse({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    status: customer.status,
    password: customer.password,
  });

  if (!response.success)
    return { message: "Error", errors: response.error.flatten().fieldErrors };

  const params = {
    first_name: response.data.firstName,
    last_name: response.data.lastName,
    email_address: [response.data.email],
    password: response.data.password,
    publicMetadata: {
      status: response.data.status,
    },
  };

  await customerClerk.users.createUser(params);
  revalidatePath("/customer/customer-management");

  return { message: "Customer created successfully" };
};

const deleteCustomer = async (customerId: string) => {
  await customerClerk.users.deleteUser(customerId);
};

const updateCustomer = async (customer: {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
}): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
  const customerSchema = z.object({
    id: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    status: z.enum(["whitelisted", "blacklisted"]),
  });

  const response = customerSchema.safeParse({
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    status: customer.status,
  });

  if (!response.success) {
    return { message: "Error", errors: response.error.flatten().fieldErrors };
  }

  const userParams = {
    firstName: response.data.firstName,
    lastName: response.data.lastName,
  };

  const metadataParams = {
    publicMetadata: {
      status: response.data.status,
    },
  };

  await customerClerk.users.updateUser(customer.id, userParams);
  await customerClerk.users.updateUserMetadata(customer.id, metadataParams);

  revalidatePath("/staff/customer-management");

  return { message: "Customer updated successfully" };
};

const addCommentToCustomer = async (customerId: string, comment: string) => {
  const customer = await customerClerk.users.getUser(customerId);
  const comments = (customer.publicMetadata.comments as string[]) || [];
  comments.push(comment);
  await customerClerk.users.updateUserMetadata(customerId, {
    publicMetadata: { comments },
  });
  revalidatePath("/staff/customer-management/customer-details/" + customerId);
};

const getCustomerName = async (id: string) => {
  const user = await customerClerk.users.getUser(id);

  if (!user) throw new Error("No customer found with that id");

  return JSON.stringify(user.fullName);
};

export {
  getCustomers,
  getCustomerByEmail,
  getCustomerById,
  addCustomer,
  deleteCustomer,
  updateCustomer,
  addCommentToCustomer,
  getCustomerName,
};
