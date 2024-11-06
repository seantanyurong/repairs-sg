import { getVehicleByLicencePlate } from '@/lib/actions/vehicles';
import MapClient from './clientPage';

export default async function ViewLocation({ params }: { params: { licencePlate: string } }) {
  
  let locationData = await fetch(
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

  const liveLat = liveLocation.latitude;
  const liveLon = liveLocation.longitude;

  console.log("liveLocation");
  console.log(liveLocation);


  return (
    <MapClient
      initialLat={liveLat}
      initialLon={liveLon}
      vehicle={vehicle}
    />
  );
}
