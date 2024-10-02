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
    </TableRow>
  );
}
