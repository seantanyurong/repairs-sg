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
import { updateJobStaff, updateJobStatus, updateJobVehicle } from '@/lib/actions/jobs';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addReward } from '@/lib/actions/rewards';

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
  vehicleArray,
  referralCode
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
  referralCode?: { code: string; referrer: string; customer: string; };
}) {

  const router = useRouter();
  const statusArray = ['Pending', 'Arrived', 'In Progress', 'Completed', 'Cancelled'];
  const REFERRAL_REWARD = 15;
  const REFERRAL_ACTIVE = "ACTIVE";

  const handleAssignStaff = async (jobId: string, staffId: string) => {
    await updateJobStaff(jobId, staffId); // Call the parent function to update the job with selected staff
  };

  const handleAssignVehicle = async (jobId: string, vehicleId: string) => {
    await updateJobVehicle(jobId, vehicleId); // Call the parent function to update the job with selected vehicle
  };

  const handleUpdateStatus = async (jobId: string, status: string, referralCode?: { code: string; referrer: string; customer: string; }) => {
    if (status === 'Completed' || status === 'Cancelled') {
      const confirmStatusChange = window.confirm(`Are you sure you want to change the status to ${status}? You will not be able to revert this action.`);
      if (!confirmStatusChange) return;
    }
    await updateJobStatus(jobId, status); // Call the parent function to update the job with selected vehicle

    if (status === 'Completed' && referralCode ) {
      console.log('Referral code:', referralCode);
      // Add referral reward for referrer
      await addReward({
        userId: referralCode.referrer,
        rewardCode: `REW${referralCode.code.slice(-6)}`,
        type: 'REFERRAL',
        amount: 15,
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 6 * 30)).toISOString(),
        status: REFERRAL_ACTIVE,
      });

      // Add referral reward for customer
      await addReward({
        userId: referralCode.customer,
        rewardCode: `REW${referralCode.code.slice(-6)}`,
        type: 'REFERRAL',
        amount: 15,
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 6 * 30)).toISOString(),
        status: REFERRAL_ACTIVE,
      });
      console.log('Referral rewards added');
    }
  }

  const openGoogleMaps = (searchTerm: string) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchTerm)}`;
    window.open(googleMapsUrl, "_blank"); // Opens in a new tab
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
            {/* only render this item if status is not completed or cancelled */}
            {status !== 'Completed' && status !== 'Cancelled' && (
                <DropdownMenuItem
                className='cursor-pointer'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost'>
                      Update Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Job Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {statusArray.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleUpdateStatus(id, status, referralCode, )}
                        className='cursor-pointer'>
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => router.push(`/staff/vehicles/view-vehicle-location/${vehicleLicencePlate}`)}
              className='cursor-pointer'>
              View Vehicle Location
            </DropdownMenuItem>
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
            <DropdownMenuItem
              onClick={() => openGoogleMaps(address)}
              className='cursor-pointer'>
              View Address
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
      </TableCell>
    </TableRow>
  );
}