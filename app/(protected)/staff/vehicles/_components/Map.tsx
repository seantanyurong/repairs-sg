'use client';
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

export default function Map({ 
    liveLat, 
    liveLon 
}: { 
    liveLat: number, 
    liveLon: number 
}) {
    const [streetName, setStreetName] = useState<string | null>(null);
    const centre = { lat: liveLat, lng: liveLon };
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        if (googleMapsApiKey) {
            const fetchStreetName = async () => {
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${liveLat},${liveLon}&key=${googleMapsApiKey}`
                );
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const addressComponents = data.results[0].address_components;
                    console.log(addressComponents);
                    const streetComponent = addressComponents[0].long_name + ' ' + addressComponents[1].long_name + ', ' + addressComponents[2].long_name + ', ' + addressComponents[5].long_name;
                    setStreetName(streetComponent ? streetComponent : 'Street name not found');
                } else {
                    setStreetName('Street name not found');
                }
            };

            fetchStreetName();
        }
    }, [liveLat, liveLon, googleMapsApiKey]);

    if (!googleMapsApiKey) {
        return <div>Error: Google Maps API key is missing</div>;
    }

    return (
        <>
            <div>
              {streetName ? `We are at ${streetName}` : 'Loading street name...'}
            </div>
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
                <GoogleMap mapContainerStyle={containerStyle} center={centre} zoom={18}>
                    <Marker position={centre} />
                </GoogleMap>
            </LoadScript>
            
        </>
    );
}
