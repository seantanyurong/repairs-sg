"use server";

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

export { getCustomers, getCustomerByEmail, getCustomerById };
