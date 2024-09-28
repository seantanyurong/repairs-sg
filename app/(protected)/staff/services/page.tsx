import { getServices } from '@/lib/actions/services';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServiceRow from './_components/ServiceRow';

export default async function Services() {
  const services = await getServices();

  const serviceDisplay = (status?: string) => {
    if (status === 'all') {
      return services.map((service) => {
        return (
          <ServiceRow
            key={service._id.toString()}
            id={service._id.toString()}
            name={service.name}
            price={service.price}
            status={service.status}
            createdAt={service.createdAt.toString()}
          />
        );
      });
    }

    // Filter by status
    return services
      .filter((service) => service.status.toLowerCase() === status)
      .map((service) => {
        return (
          <ServiceRow
            key={service._id.toString()}
            id={service._id.toString()}
            name={service.name}
            price={service.price}
            status={service.status}
            createdAt={service.createdAt.toString()}
          />
        );
      });
  };

  const serviceCount = (status?: string) => {
    if (status === 'all') {
      return services.length;
    }

    return services.filter((service) => service.status.toLowerCase() === status).length;
  };

  const cardDisplay = (status?: string) => {
    if (services.length === 0) {
      return <div className='mt-4'>No services found</div>;
    }

    return (
      <Card x-chunk='dashboard-06-chunk-0'>
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>Manage your services and edit their details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='hidden w-[100px] sm:table-cell'>
                  <span className='sr-only'>Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='hidden md:table-cell'>Price</TableHead>
                <TableHead className='hidden md:table-cell'>Created at</TableHead>
                <TableHead>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{serviceDisplay(status)}</TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className='text-xs text-muted-foreground'>
            Showing{' '}
            <strong>
              {serviceCount(status) === 0 ? '0' : '1'}-{serviceCount(status)}
            </strong>{' '}
            of <strong>{serviceCount(status)}</strong> services
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
          <Link href='/staff/services/create-service'>
            <Button size='sm' className='h-8 gap-1'>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Create Service</span>
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
