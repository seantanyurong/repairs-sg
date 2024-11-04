'use client';

import { Label } from '@radix-ui/react-label';

export default function CustomerDetailsClient({
  customer,
}: {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
  };
}) {
  return (
    <>
      <div className='grid gap-9 py-9'>
        <div className='flex gap-4 items-center'>
          <Label htmlFor='username' className='text-right'>
            First Name
          </Label>
          <p className='text-sm text-muted-foreground col-span-3'>{customer.firstName || '-'}</p>
        </div>
        <div className='flex gap-4 items-center'>
          <Label htmlFor='username' className='text-right'>
            Last Name
          </Label>
          <p className='text-sm text-muted-foreground'>{customer.lastName || '-'}</p>
        </div>
        <div className='flex gap-4 items-center'>
          <Label htmlFor='username' className='text-right'>
            Email
          </Label>
          <p className='text-sm text-muted-foreground col-span-3 break-words'>{customer.email || '-'}</p>
        </div>
        <div className='flex gap-4 items-center'>
          <Label htmlFor='status' className='text-right'>
            Status
          </Label>
          <p className='text-sm text-muted-foreground col-span-3 break-words'>{customer.status || '-'}</p>
        </div>
      </div>
    </>
  );
}
