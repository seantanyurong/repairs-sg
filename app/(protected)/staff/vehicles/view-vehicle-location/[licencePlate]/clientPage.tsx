"use client";

import { useEffect, useState } from 'react';
import Map from '../../_components/Map';

export default function MapClient({ initialLat, initialLon, gpsApi }: { initialLat: number, initialLon: number, gpsApi: string }) {
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

        const liveLocation = locationData.filter(function (location: { deviceId: number | null; }) {
            return location.deviceId === parseInt(gpsApi);
        })

        if (liveLocation) {
            console.log("Data refreshed");
            console.log(liveLocation);
            console.log(liveLocation[0].latitude);
            console.log(liveLocation[0].longitude);
            console.log("before set state")
            console.log(liveLat);
            console.log(liveLon);

            setLiveLat(liveLocation[0].latitude);
            setLiveLon(liveLocation[0].longitude);

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
  }, [gpsApi]);

  useEffect(() => {
    console.log("useeffect");
    console.log(liveLat);
    console.log(liveLon);
  }
  , [liveLat, liveLon]);

  return (
    <div>   
      {/* Render the map with the live location */}
      <p>Latitude: {liveLat}</p>
      <p>Longitude: {liveLon}</p>
      <Map
        liveLat={liveLat}
        liveLon={liveLon}
        />
    </div>
  );
}
