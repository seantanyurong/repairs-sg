'use client';

import Image from 'next/image';
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
import { deleteService } from '@/lib/actions/services';
import { useRouter } from 'next/navigation';

export default function ServiceRow({
  id,
  name,
  price,
  status,
  createdAt,
}: {
  id: string;
  name: string;
  price: number;
  status: string;
  createdAt: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this service?');
    if (confirmed) {
      await deleteService(id);
      router.refresh();
    }
  };

  return (
    <TableRow>
      <TableCell className='hidden sm:table-cell'>
        <Image
          alt='Product image'
          className='aspect-square rounded-md object-cover'
          height='64'
          src='/images/placeholder.svg'
          width='64'
        />
      </TableCell>
      <TableCell className='font-medium'>{name}</TableCell>
      <TableCell>
        <Badge variant='outline'>{status}</Badge>
      </TableCell>
      <TableCell className='hidden md:table-cell font-medium'>{price}</TableCell>
      <TableCell className='hidden md:table-cell'>{createdAt}</TableCell>
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
              onClick={() => router.push(`/staff/services/edit-service/${id}`)}
              className='cursor-pointer'>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className='cursor-pointer'>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
