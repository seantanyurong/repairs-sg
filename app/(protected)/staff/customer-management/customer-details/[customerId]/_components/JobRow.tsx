'use client';

import { TableCell, TableRow } from '@/components/ui/table';

export default function JobRow({
  serviceName,
  description,
  address,
  timeStart,
  timeEnd,
}: {
  id: string;
  serviceName: string;
  description: string;
  address: string;
  timeStart: string;
  timeEnd: string;
}) {
  return (
    <TableRow>
      <TableCell className='font-medium'>{serviceName}</TableCell>
      <TableCell className='font-medium'>{description}</TableCell>
      <TableCell className='font-medium'>{address}</TableCell>
      <TableCell className='font-medium'>{timeStart}</TableCell>
      <TableCell className='font-medium'>{timeEnd}</TableCell>
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
