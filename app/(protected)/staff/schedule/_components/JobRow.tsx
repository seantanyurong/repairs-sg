'use client';

import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { updateJobStaff, updateJobVehicle } from '@/lib/actions/jobs';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function JobRow({
  id,
  serviceName,
  description,
  address,
  customerName,
  staffName,
  vehicleLicencePlate,
  timeStart,
  timeEnd,
  status,
  staffArray,
  vehicleArray
}: {
  id: string;
  serviceName: string;
  description: string;
  address: string;
  customerName: string;
  staffName: string;
  vehicleLicencePlate: string;
  timeStart: string;
  timeEnd: string;
  status: string;
  staffArray: { id: string; name: string }[]; // List of staff to assign
  vehicleArray: { id: string; licencePlate: string }[]; // List of vehicles to assign
}) {

  const router = useRouter();

  const handleAssignStaff = async (jobId: string, staffId: string) => {
    await updateJobStaff(jobId, staffId); // Call the parent function to update the job with selected staff
  };

  const handleAssignVehicle = async (jobId: string, vehicleId: string) => {
    await updateJobVehicle(jobId, vehicleId); // Call the parent function to update the job with selected vehicle
  };

  return (
    <TableRow>
      <TableCell className='font-medium'>{serviceName}</TableCell>
      <TableCell className='font-medium'>{description}</TableCell>
      <TableCell className='font-medium'>{address}</TableCell>
      <TableCell className='font-medium'>{customerName}</TableCell>
      <TableCell className='font-medium'>{staffName}</TableCell>
      <TableCell className='font-medium'>{vehicleLicencePlate}</TableCell>
      <TableCell className='font-medium'>{timeStart}</TableCell>
      <TableCell className='font-medium'>{timeEnd}</TableCell>
      <TableCell>
        <Badge variant='outline'>{status}</Badge>
      </TableCell>
      <TableCell>
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup='true' size='icon' variant='ghost'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push(`/staff/schedule/edit-job/${id}`)}
              className='cursor-pointer'>
              Edit Job
            </DropdownMenuItem>
            <DropdownMenuItem
              className='cursor-pointer'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost'>
                    Assign Vehicle
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Available Vehicles</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {vehicleArray.map((vehicle) => (
                    <DropdownMenuItem
                      key={vehicle.id}
                      onClick={() => handleAssignVehicle(id, vehicle.id)}
                      className='cursor-pointer'>
                      {vehicle.licencePlate}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuItem>
            <DropdownMenuItem
              className='cursor-pointer'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost'>
                    Assign Staff
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Available Staff</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {staffArray.map((staff) => (
                    <DropdownMenuItem
                      key={staff.id}
                      onClick={() => handleAssignStaff(id, staff.id)}
                      className='cursor-pointer'>
                      {staff.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/staff/invoices/create-invoice?jobId=${id}`)}
              className='cursor-pointer'>
              Create Invoice
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/staff/invoices?jobId=${id}`)}
              className='cursor-pointer'>
              View Invoices
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
      </TableCell>
    </TableRow>
  );
}