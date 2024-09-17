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

  const serviceDisplay = () => {
    if (services.length === 0) {
      return <div>No services found</div>;
    }
    return (
      <>
        {services.map((service) => {
          return (
            <ServiceRow
              key={service._id.toString()}
              id={service._id.toString()}
              name={service.name}
              status={service.status}
              createdAt={service.createdAt.toString()}
            />
          );
        })}
      </>
    );
  };

  return (
    <Tabs defaultValue='all'>
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='all'>All</TabsTrigger>
          {/* <TabsTrigger value='active'>Active</TabsTrigger>
          <TabsTrigger value='draft'>Draft</TabsTrigger>
          <TabsTrigger value='archived' className='hidden sm:flex'>
            Archived
          </TabsTrigger> */}
        </TabsList>
        <div className='ml-auto flex items-center gap-2'>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='h-8 gap-1'>
                <ListFilter className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          {/* <Button size='sm' variant='outline' className='h-8 gap-1'>
            <File className='h-3.5 w-3.5' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Export</span>
          </Button> */}
          <Link href='/staff/services/create-service'>
            <Button size='sm' className='h-8 gap-1'>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Create Service</span>
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent value='all'>
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
                  <TableHead className='hidden md:table-cell'>Created at</TableHead>
                  <TableHead>
                    <span className='sr-only'>Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{serviceDisplay()}</TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className='text-xs text-muted-foreground'>
              Showing <strong>1-{services.length}</strong> of <strong>{services.length}</strong> services
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
