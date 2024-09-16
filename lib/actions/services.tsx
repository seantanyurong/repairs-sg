'use server';

import { connectToMongoDB } from '@/lib/db';
import Service from '@/models/Service';

const addService = async (service: FormData) => {
  const name = service.get('name');

  const newService = new Service({ name });
  newService.save();
};

const getServices = async () => {
  connectToMongoDB();
  return Service.find();
};

export { addService, getServices };
