'use client';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
  };
  
export default function Map({ 
    liveLat, 
    liveLon
}:{
    liveLat: number,
    liveLon: number
}) {

    const centre = {
        lat: liveLat,
        lng: liveLon
      };

    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!googleMapsApiKey) {
        return <div>Error: Google Maps API key is missing</div>;
    }

    // const getAddressFromCoordinates = () => {
    //     const geocoder = new window.google.maps.Geocoder();
    //     geocoder.geocode({ location: centre }, (results, status) => {
    //         if (status === "OK") {
    //         const address = results![0].formatted_address;
    //         console.log("Address:", address);
    //         return address;
    //         } else {
    //         console.error("Geocoder failed:", status);
    //         return null;
    //         }
    //     });
    // }

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={centre}
            zoom={15}
          >
            <Marker position={centre} />
          </GoogleMap>
        </LoadScript>
      );
}