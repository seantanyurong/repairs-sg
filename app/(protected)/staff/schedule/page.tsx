import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobRow from './_components/JobRow';
import { getJobsWithServiceAndVehicle } from '@/lib/actions/jobs';
import { DropdownMenuCheckboxes } from './_components/DropdownMenuCheckboxes';
import CalendarClient from './clientComponent';
import { findAvailableStaff, findAvailableVehicles } from './_utils';
import { getLeaves } from '@/lib/actions/leave';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { auth, clerkClient, createClerkClient } from "@clerk/nextjs/server";
import { getVehicles } from '@/lib/actions/vehicles';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type SearchParams = {
  filters?: string;
  date?: string;
};

export default async function Schedule({ searchParams }: { searchParams: SearchParams }) {
  const jobs = await getJobsWithServiceAndVehicle();
  const leaves = await getLeaves();

  const userId = auth().userId;
  console.log(userId);
  const user = await clerkClient().users.getUser(userId as string);
  const role = user.publicMetadata.role;

  const staff = await clerkClient().users.getUserList();

  const custClerk = createClerkClient({
    secretKey: process.env.CUSTOMER_CLERK_SECRET_KEY,
  });
  const customers = await custClerk.users.getUserList();

  const vehicles = await getVehicles();

  const vehicleArray = vehicles
  .filter((vehicle) => vehicle.status === 'Active')
  .map((vehicle) => {
    return { id: vehicle._id.toString(), licencePlate: vehicle.licencePlate };
  });

  // convert this PaginatedResourceResponse<User[]>into an array
  const staffArray = staff.data.map((staff) => {
    return { id: String(staff.id).trim(), name: staff.firstName + ' ' + staff.lastName };
  });

  const customerArray = customers.data.map((customer) => {
    return { id: String(customer.id).trim(), name: customer.firstName + ' ' + customer.lastName };
  });

  // checking query params
  const filters = searchParams.filters;
  const filtersArray = filters ? filters.split(',') : [];
  console.log(filtersArray);

  // convert the staff attribute in jobs to hold the name of the staff instead of the id
  jobs.map((job) => {
    job.staff = staffArray.find((staff) => staff.id === job.staff)?.name || '';
    job.customer = customerArray.find((customer) => customer.id === job.customer)?.name || '';
  });

  const jobTableDisplay = () => {
    if (jobs.length === 0) {
      return <div>No jobs found</div>;
    }

    // return all if there is no filter param
    if (filtersArray[0] === 'all') {
      return jobs.map((job) => {
        
        // const commentsArray = job.comments.map((comment: { sender: string; content: string; }) => {
        //   return { sender: comment.sender, content: comment.content };
        // });

        return (
          <JobRow
            key={job._id.toString()}
            id={job._id.toString()}
            serviceName={job.service.name}
            description={job.description}
            address={job.jobAddress}
            customerName={job.customer}
            staffName={job.staff}
            vehicleLicencePlate={job.vehicle?.licencePlate}
            timeStart={job.schedule.timeStart.toLocaleString('en-GB')}
            timeEnd={job.schedule.timeEnd.toLocaleString('en-GB')}
            status={job.status}
            staffArray={findAvailableStaff(staffArray, jobs, leaves, job.schedule.timeStart, job.schedule.timeEnd)}
            vehicleArray={findAvailableVehicles(vehicleArray, jobs, job.schedule.timeStart, job.schedule.timeEnd)}
            referralCode={job.referralCode}
          />
        );
      });
    }

    // Filter by staff in filtersArray
    return jobs
      .filter((job) => filtersArray.includes(job.staff))
      .map((job) => {

        return (
          <JobRow
            key={job._id.toString()}
            id={job._id.toString()}
            serviceName={job.service.name}
            description={job.description}
            address={job.jobAddress}
            customerName={job.customer}
            staffName={job.staff}
            vehicleLicencePlate={job.vehicle?.licencePlate}
            timeStart={job.schedule.timeStart.toLocaleString('en-GB')}
            timeEnd={job.schedule.timeEnd.toLocaleString('en-GB')}
            status={job.status}
            staffArray={findAvailableStaff(staffArray, jobs, leaves, job.schedule.timeStart, job.schedule.timeEnd)}
            vehicleArray={findAvailableVehicles(vehicleArray, jobs, job.schedule.timeStart, job.schedule.timeEnd)}
            referralCode={job.referralCode}
          />
        );
      });
  };

  const jobCount = (filtersArray: string[]) => {
    if (filtersArray[0] === 'all') {
      return jobs.length;
    } else if (filtersArray.length === 0) {
      return 0;
    }

    return jobs.filter((job) => filtersArray.includes(job.staff)).length;
  };

  const tableDisplay = () => {
    return (
      <Card x-chunk='dashboard-06-chunk-0'>
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
          <CardDescription>Manage your Jobs and edit their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{jobTableDisplay()}</TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className='text-xs text-muted-foreground'>
            Showing{' '}
            <strong>
              {jobCount(filtersArray) === 0 ? '0' : '1'}-{jobCount(filtersArray)}
            </strong>{' '}
            of <strong>{jobCount(filtersArray)}</strong> jobs
          </div>
        </CardFooter>
      </Card>
    );
  };

  

  const tempJobs = jobs.map((job) => {
    return {
      _id: job._id.toString(),
      service: job.service.name,
      quantity: job.quantity,
      address: job.jobAddress,
      timeStart: new Date(job.schedule.timeStart.toISOString().replace('.000', '')),
      timeEnd: new Date(job.schedule.timeEnd.toISOString().replace('.000', '')),
      title: job.description,
      customer: job.customer,
      staff: job.staff,
      vehicle: job.vehicle?.licencePlate || '',
      status: job.status,
      color: 'blue',
    };
  });

  const date = searchParams.date;
  const view = searchParams.date ? 'calendar' : 'table';
  return (
    <Tabs defaultValue={view}>
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='table'>Table</TabsTrigger>
          <TabsTrigger value='calendar'>Calendar</TabsTrigger>
        </TabsList>
        <DropdownMenuCheckboxes
          items={staffArray.map((staff) => {
            return { label: staff.name };
          })}></DropdownMenuCheckboxes>
        <div className='ml-auto flex items-center gap-2'>
        <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Help</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Help</DialogTitle>
          <div></div>
          <DialogDescription>
            <ul className="list-disc list-inside">
              <li>Only jobs with Pending status can be edited and assigned a staff and vehicle.</li>
              <li>Vehicle locations can be viewed only when jobs have a vehicle assigned and are not in Pending status.</li>
              <li>Cancelled and Completed jobs cannot be edited.</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
         </div>
        </div>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>

          <Link href='/staff/schedule/create-job'>
            <Button size='sm' className='h-8 gap-1'>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Create Job</span>
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent value='calendar'>
        <CalendarClient filtersArray={filtersArray} jobs={tempJobs} role={role as string} date={date}/>
      </TabsContent>
      <TabsContent value='table'>{tableDisplay()}</TabsContent>
    </Tabs>
  );
}

//