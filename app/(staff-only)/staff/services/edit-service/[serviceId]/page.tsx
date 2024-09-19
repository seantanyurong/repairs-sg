import { getService } from '@/lib/actions/services';
import EditServiceClient from './clientPage';

export default async function EditService({ params }: { params: { serviceId: string } }) {
  const service = await getService(params.serviceId);

  return (
    <EditServiceClient
      service={{
        _id: service._id.toString(),
        name: service.name,
        description: service.description,
        price: service.price,
        volumeDiscountPercentage: service.volumeDiscountPercentage,
        status: service.status,
      }}
    />
  );
}
