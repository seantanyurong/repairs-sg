import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobRow from './_components/JobRow';
import { clerkClient } from '@clerk/nextjs/server';
import { getJobsForSchedule } from '@/lib/actions/jobs';
import { getSchedules } from '@/lib/actions/schedules';
import { getServices } from '@/lib/actions/services';
import { DropdownMenuCheckboxes } from './_components/DropdownMenuCheckboxes';
import CalendarClient from './clientComponent';

type SearchParams = {
  filters?: string;
};

export default async function Schedule({ searchParams }: { searchParams: SearchParams }) {
  const jobs = await getJobsForSchedule();
  // console.log(jobs);

  const services = await getServices();
  const schedules = await getSchedules();

  const staff = await clerkClient().users.getUserList();

  // convert this PaginatedResourceResponse<User[]>into an array
  const staffArray = staff.data.map((staff) => {
    return { id: String(staff.id).trim(), name: staff.firstName + ' ' + staff.lastName };
  });
  console.log(staffArray);

  const filters = searchParams.filters;
  const filtersArray = filters ? filters.split(',') : [];
  console.log(filtersArray);

  // convert the staff attribute in jobs to hold the name of the staff instead of the id
  jobs.map((job) => {
    job.staff = staffArray.find((staff) => staff.id === job.staff)?.name || 'Unknown Staff';
  });

  const jobTableDisplay = () => {
    if (jobs.length === 0) {
      return <div>No jobs found</div>;
    }

    // return all if there is no filter param
    if (filtersArray[0] === 'all') {
      return jobs.map((job) => {
        return (
          <JobRow
            key={job._id.toString()}
            id={job._id.toString()}
            serviceName={job.service.name}
            description={job.description}
            address={job.jobAddress}
            staffName={job.staff}
            timeStart={job.schedule.timeStart.toLocaleString('en-GB')}
            timeEnd={job.schedule.timeEnd.toLocaleString('en-GB')}
            status={job.status}
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
            staffName={job.staff}
            timeStart={job.schedule.timeStart.toLocaleString('en-GB')}
            timeEnd={job.schedule.timeEnd.toLocaleString('en-GB')}
            status={job.status}
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
          <CardDescription>Manage your Jobs and edit their details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Staff</TableHead>
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
      timeStart: job.schedule.timeStart.toISOString().replace('.000', ''),
      timeEnd: job.schedule.timeEnd.toISOString().replace('.000', ''),
      title: job.description,
      staff: job.staff,
      color: 'blue',
    };
  });

  return (
    <Tabs defaultValue='table'>
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='table'>Table</TabsTrigger>
          <TabsTrigger value='calendar'>Calendar</TabsTrigger>
        </TabsList>
        <DropdownMenuCheckboxes
          items={staffArray.map((staff) => {
            return { label: staff.name };
          })}></DropdownMenuCheckboxes>
        {/* <DropdownMenuCheckboxes
          items={ services.map((service) => { return { label: service.name }; })}>
        </DropdownMenuCheckboxes> */}
        <div className='ml-auto flex items-center gap-2'>
          {/* <Link href='/staff/jobs/create-event'>
            <Button size='sm' className='h-8 gap-1'>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Create Event</span>
            </Button>
          </Link> */}
        </div>
      </div>
      <TabsContent value='calendar'>
        <CalendarClient filtersArray={filtersArray} jobs={tempJobs} />
      </TabsContent>
      <TabsContent value='table'>{tableDisplay()}</TabsContent>
    </Tabs>
  );
}

//
