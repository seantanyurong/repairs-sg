'use server';

import Staff from '@/models/Staff';

const getStaff = async () => {
  return Staff.find();
};

export { getStaff };
