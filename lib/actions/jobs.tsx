'use server';

import Job from '@/models/Job';

// const addService = async (service: {
//   name: string;
//   description: string;
//   price: number;
//   volumeDiscountPercentage: number;
//   status: string;
// }): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
//   const serviceSchema = z.object({
//     name: z.string().min(1),
//     description: z.string().min(1),
//     price: z.number(),
//     volumeDiscountPercentage: z.number(),
//     status: z.enum(['Draft', 'Active', 'Disabled']),
//   });

//   const response = serviceSchema.safeParse({
//     name: service.name,
//     description: service.description,
//     price: service.price,
//     volumeDiscountPercentage: service.volumeDiscountPercentage,
//     status: service.status,
//   });

//   if (!response.success) {
//     return { message: 'Error', errors: response.error.flatten().fieldErrors };
//   }

//   const newService = new Service(response.data);
//   newService.save();

//   return { message: 'Service added successfully' };
// };

// const updateService = async (service: {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   volumeDiscountPercentage: number;
//   status: string;
// }): Promise<{ message: string; errors?: string | Record<string, unknown> }> => {
//   const serviceSchema = z.object({
//     _id: z.string().min(1),
//     name: z.string().min(1),
//     description: z.string().min(1),
//     price: z.number(),
//     volumeDiscountPercentage: z.number(),
//     status: z.enum(['Draft', 'Active', 'Disabled']),
//   });

//   const response = serviceSchema.safeParse({
//     _id: service._id,
//     name: service.name,
//     description: service.description,
//     price: service.price,
//     volumeDiscountPercentage: service.volumeDiscountPercentage,
//     status: service.status,
//   });

//   console.log(response.data);

//   if (!response.success) {
//     return { message: 'Error', errors: response.error.flatten().fieldErrors };
//   }

//   const filter = { _id: new ObjectId(response.data._id) };
//   const update = {
//     name: response.data.name,
//     description: response.data.description,
//     price: response.data.price,
//     volumeDiscountPercentage: response.data.volumeDiscountPercentage,
//     status: response.data.status,
//   };
//   await Service.findOneAndUpdate(filter, update);
//   revalidatePath('/staff/services');

//   return { message: 'Service updated successfully' };
// };

// const deleteService = async (serviceId: string) => {
//   await Service.findByIdAndDelete(serviceId);
//   revalidatePath('/staff/services');
// };

// const getService = async (serviceId: string) => {
//   return Service.findById(serviceId);
// };

const getJobs = async () => {
  return Job.find();
};

const getJobsForSchedule = async () => {
  const jobs = await Job.find()
  .populate('schedule')
  .populate('service')
  .exec();

  return jobs;
};


// export { addService, updateService, deleteService, getService, getServices };
export { getJobs, getJobsForSchedule};
