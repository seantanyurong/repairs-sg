"use client";

import { useEffect, useState } from 'react';
import Map from '../../_components/Map';

export default function MapClient({ initialLat, initialLon, vehicle }: { initialLat: number, initialLon: number, vehicle: { gpsApi: string } }) {
  const [liveLat, setLiveLat] = useState(initialLat);
  const [liveLon, setLiveLon] = useState(initialLon);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
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

        let liveLocation = locationData.filter(function (location: { deviceId: number | null; }) {
            return location.deviceId === parseInt(vehicle.gpsApi);
        })

        if (liveLocation) {
            console.log("Data refreshed");
            console.log(liveLocation);
            setLiveLat(liveLocation.latitude);
            setLiveLon(liveLocation.longitude);

            console.log(liveLat);
            console.log(liveLon);
        }
      } catch (error) {
        console.error("Failed to fetch location data:", error);
      }
    };

    // Fetch immediately, then every 60 seconds
    fetchLocationData();
    const interval = setInterval(fetchLocationData, 60000); // 60000 ms = 60 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [vehicle.gpsApi]);

  return (
    <div>   
      {/* Render the map with the live location */}
      <p>Latitude: {liveLat}</p>
      <p>Longitude: {liveLon}</p>
      {/* Render the map or any other components here */}
      <Map
        liveLat={liveLat}
        liveLon={liveLon}
        />
    </div>
  );
}
