'use server';

import Address from '@/models/Address';

const getAddress = async () => {
  return Address.find();
};

export { getAddress };
