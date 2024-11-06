'use client';

import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from '@/components/ui/select';
import { updateJob } from '@/lib/actions/jobs';
import { useUser } from '@clerk/clerk-react';
import { format, addHours, startOfDay, addDays, isAfter } from 'date-fns';
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