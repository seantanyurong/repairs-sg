'use client';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { deleteVehicle } from '@/lib/actions/vehicles';
import { useRouter } from 'next/navigation';
import { custom } from 'zod';

export default function JobRow({
  id,
  categoryType,
  description,
  address,
  customerName,
  staffName,
  timeStart,
  timeEnd,
  status
}: {
  id: string;
  categoryType: string;
  description: string;
  address: string;
  customerName: string;
  staffName: string;
  timeStart: string;
  timeEnd: string;
  status: string;
}) {
  const router = useRouter();

  return (
    <TableRow>
      <TableCell className='font-medium'>{id}</TableCell>
      <TableCell className='font-medium'>{categoryType}</TableCell>
      <TableCell className='font-medium'>{description}</TableCell>
      <TableCell className='font-medium'>{status}</TableCell>
      <TableCell className='hidden md:table-cell'>{address}</TableCell>
      <TableCell className='hidden md:table-cell'>{customerName}</TableCell>
      <TableCell className='hidden md:table-cell'>{staffName}</TableCell>
      <TableCell className='hidden md:table-cell'>{timeStart}</TableCell>
      <TableCell className='hidden md:table-cell'>{timeEnd}</TableCell>

      <TableCell>
        <Badge variant='outline'>{status}</Badge>
      </TableCell>
      <TableCell>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup='true' size='icon' variant='ghost'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push(`/staff/vehicles/edit-vehicle/${id}`)}
              className='cursor-pointer'>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteVehicle(id)} className='cursor-pointer'>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </TableCell>
    </TableRow>
  );
}
