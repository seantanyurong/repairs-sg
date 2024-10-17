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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateJobStaff } from '@/lib/actions/jobs';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';

export default function JobRow({
  id,
  serviceName,
  description,
  address,
  staffName,
  timeStart,
  timeEnd,
  status,
  staffArray,
}: {
  id: string;
  serviceName: string;
  description: string;
  address: string;
  staffName: string;
  timeStart: string;
  timeEnd: string;
  status: string;
  staffArray: { id: string; name: string }[]; // List of staff to assign
}) {

  // const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  const handleAssignStaff = async (jobId: string, staffId: string) => {
    // setSelectedStaff(staffId);
    await updateJobStaff(jobId, staffId); // Call the parent function to update the job with selected staff
  };

  return (
    <TableRow>
      <TableCell className='font-medium'>{serviceName}</TableCell>
      <TableCell className='font-medium'>{description}</TableCell>
      <TableCell className='font-medium'>{address}</TableCell>
      <TableCell className='font-medium'>{staffName}</TableCell>
      <TableCell className='font-medium'>{timeStart}</TableCell>
      <TableCell className='font-medium'>{timeEnd}</TableCell>
      <TableCell>
        <Badge variant='outline'>{status}</Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>
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
      </TableCell>
    </TableRow>
  );
}