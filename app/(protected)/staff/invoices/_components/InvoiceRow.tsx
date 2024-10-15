'use client';

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
import { useRouter } from 'next/navigation';
import dayjs from "dayjs";

export default function InvoiceRow({
  invoiceId,
  dateIssued,
  totalAmount,
  lineItems,
  paymentStatus,
  paymentMethod,
  customer,
}: {
  invoiceId: number;
  dateIssued: Date;
  totalAmount: number;
  lineItems: Array<string>;
  paymentStatus: string;
  validityStatus: string;
  paymentMethod: string;
  customer: string;
}) {
  const router = useRouter();

  // Format Date
  const formattedDateIssued = dayjs(dateIssued).format("DD/MM/YYYY");

  return (
    <TableRow>
      <TableCell className='font-medium'>{invoiceId.toString()}</TableCell>
      <TableCell className='font-medium'>{formattedDateIssued.toString()}</TableCell>
      <TableCell className='font-medium'>{customer}</TableCell>
      <TableCell className='font-medium'>${totalAmount.toString()}</TableCell>
      <TableCell className='font-medium'>{lineItems.length.toString()} Items</TableCell>
      <TableCell className='font-medium'>{paymentStatus}</TableCell>
      <TableCell className='font-medium'>{paymentMethod}</TableCell>
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
              onClick={() => router.push(`/staff/invoices/edit-invoice/${invoiceId}`)}
              className='cursor-pointer'>
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
