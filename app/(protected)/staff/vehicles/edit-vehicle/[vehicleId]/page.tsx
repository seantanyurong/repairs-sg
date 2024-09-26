import { getVehicle } from '@/lib/actions/vehicles';
import EditVehicleClient from './clientPage';

export default async function EditVehicle({ params }: { params: { vehicleId: string } }) {
  const vehicle = await getVehicle(params.vehicleId);

  return (
    <EditVehicleClient
      vehicle={{
        _id: vehicle._id.toString(),
        licencePlate: vehicle.licencePlate,
        gpsApi: vehicle.gpsApi,
        make: vehicle.make,
        model: vehicle.model,
        status: vehicle.status,
      }}
    />
  );
}
