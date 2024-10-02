'use server';

import Customers from '@/models/Customer';

const getCustomers = async () => {
  return Customers.find();
};

export { getCustomers };
