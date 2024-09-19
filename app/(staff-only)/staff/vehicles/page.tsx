import { getVehicles } from '@/lib/actions/vehicles';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VehicleRow from './_components/VehicleRow';

export default async function Vehicles() {
  const vehicles = await getVehicles();

  const vehicleDisplay = (status?: string) => {
    if (vehicles.length === 0) {
      return <div>No vehicles found</div>;
    }

    if (status === 'all') {
      return vehicles.map((vehicle) => {
        return (
          <VehicleRow
            key={vehicle._id.toString()}
            id={vehicle._id.toString()}
            licencePlate={vehicle.licencePlate}
            gpsApi={vehicle.gpsApi}
            make={vehicle.make}
            model={vehicle.model}
            status={vehicle.status}
            createdAt={vehicle.createdAt.toString()}
          />
        );
      });
    }

    // Filter by status
    return vehicles
      .filter((vehicle) => vehicle.status.toLowerCase() === status)
      .map((vehicle) => {
        return (
          <VehicleRow
            key={vehicle._id.toString()}
            id={vehicle._id.toString()}
            licencePlate={vehicle.licencePlate}
            gpsApi={vehicle.gpsApi}
            make={vehicle.make}
            model={vehicle.model}
            status={vehicle.status}
            createdAt={vehicle.createdAt.toString()}
          />
        );
      });
  };

  const vehicleCount = (status?: string) => {
    if (status === 'all') {
      return vehicles.length;
    }

    return vehicles.filter((vehicle) => vehicle.status.toLowerCase() === status).length;
  };

  const cardDisplay = (status?: string) => {
    return (
      <Card x-chunk='dashboard-06-chunk-0'>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
          <CardDescription>Manage your vehicles and edit their details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Licence Plate</TableHead>
                <TableHead>GPS API</TableHead>
                <TableHead>Make</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='hidden md:table-cell'>Created at</TableHead>
                <TableHead>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{vehicleDisplay(status)}</TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className='text-xs text-muted-foreground'>
            Showing{' '}
            <strong>
              {vehicleCount(status) === 0 ? '0' : '1'}-{vehicleCount(status)}
            </strong>{' '}
            of <strong>{vehicleCount(status)}</strong> vehicles
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <Tabs defaultValue='all'>
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='active'>Active</TabsTrigger>
          <TabsTrigger value='draft'>Draft</TabsTrigger>
          <TabsTrigger value='disabled' className='hidden sm:flex'>
            Disabled
          </TabsTrigger>
        </TabsList>
        <div className='ml-auto flex items-center gap-2'>
          <Link href='/staff/vehicles/create-vehicle'>
            <Button size='sm' className='h-8 gap-1'>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Create Vehicle</span>
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent value='all'>{cardDisplay('all')}</TabsContent>
      <TabsContent value='active'>{cardDisplay('active')}</TabsContent>
      <TabsContent value='draft'>{cardDisplay('draft')}</TabsContent>
      <TabsContent value='disabled'>{cardDisplay('disabled')}</TabsContent>
    </Tabs>
  );
}
