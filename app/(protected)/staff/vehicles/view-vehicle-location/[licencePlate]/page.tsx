import { getVehicleByLicencePlate } from '@/lib/actions/vehicles';
import MapClient from './clientPage';

export default async function ViewLocation({ params }: { params: { licencePlate: string } }) {
  
  const locationData = await fetch(
    "https://server.traccar.org/api/positions",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(`${process.env.NEXT_PUBLIC_TRACCAR_EMAIL}:${process.env.NEXT_PUBLIC_TRACCAR_PASSWORD}`).toString(
            "base64"
          ),
      },
    }
  )
    .then((res) => res.json())
    .then((json) => {
      return json;
    });

  const vehicle = await getVehicleByLicencePlate(params.licencePlate);

  let liveLocation = locationData.filter(function (location: { deviceId: number | null; }) {
    return location.deviceId === parseInt(vehicle.gpsApi);
  })

  liveLocation = liveLocation[0];

  console.log("liveLocation");
  console.log(liveLocation);


  return (
    <MapClient
      initialLat={0}
      initialLon={0}
      gpsApi={vehicle.gpsApi}
    />
  );
}
