import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CalendarCurrentDate, CalendarDayView, CalendarMonthView, CalendarNextTrigger, CalendarPrevTrigger, CalendarTodayTrigger, CalendarViewTrigger, CalendarWeekView, CalendarYearView } from '@/components/ui/full-calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ModeToggle } from '@/components/ui/theme-toggle';
import { getJobsForSchedule } from '@/lib/actions/jobs';
import JobRow from './_components/JobRow';


type SearchParams = {
  view?: string;
};

export default async function Schedule({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const jobs = await getJobsForSchedule();
  console.log(jobs);
  const viewMode = searchParams?.view || 'table';


  const jobDisplay = (status?: string) => {
    if (jobs.length === 0) {
      return <div>No jobs found</div>;
    }

    if (status === 'all') {
      return jobs.map((job) => {
        return (
          <JobRow
            key={job._id.toString()}
            id={job._id.toString()}
            categoryType={job.categoryType}
            description={job.description}
            address={job.jobAddress.address}
            customerName={job.customer.fullName}
            staffName={job.schedules.staff.fullName}
            timeStart={job.schedules.timeStart}
            timeEnd={job.schedules.timeEnd}
            status={job.status}
          />
        );
      });
    }

    // Filter by status
    return jobs
      .filter((job) => job.status.toLowerCase() === status)
      .map((job) => {
        return (
          <JobRow
            key={job._id.toString()}
            id={job._id.toString()}
            categoryType={job.categoryType}
            description={job.description}
            address={job.jobAddress.address}
            customerName={job.customer.fullName}
            staffName={job.schedules.staff.fullName}
            timeStart={job.schedules.timeStart}
            timeEnd={job.schedules.timeEnd}
            status={job.status}
          />
        );
      });
  };

  const jobCount = (status?: string) => {
    if (status === 'all') {
      return jobs.length;
    }

    return jobs.filter((job) => job.status.toLowerCase() === status).length;
  };

  const tableDisplay = (status?: string) => {
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
                <TableHead>Category Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{jobDisplay(status)}</TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className='text-xs text-muted-foreground'>
            Showing{' '}
            <strong>
              {jobCount(status) === 0 ? '0' : '1'}-{jobCount(status)}
            </strong>{' '}
            of <strong>{jobCount(status)}</strong> jobs
          </div>
        </CardFooter>
      </Card>
    );
  };

  const calendarDisplay = (status?: string) => {
    return (
      <Card x-chunk='dashboard-06-chunk-0'>
        <CardHeader>
          <CardTitle>Scheduling</CardTitle>
          <CardDescription>Manage your job schedule Calendar</CardDescription>
        </CardHeader>
        <CardContent>
        <Calendar
  events={[
    {
      id: '1',
      start: new Date('2024-08-26T09:30:00Z'),
      end: new Date('2024-08-26T14:30:00Z'),
      title: 'event A',
      color: 'pink',
    },
    {
      id: '2',
      start: new Date('2024-08-26T10:00:00Z'),
      end: new Date('2024-08-26T10:30:00Z'),
      title: 'event B',
      color: 'blue',
    },
  ]}
>
  <div className="h-dvh py-6 flex flex-col">
    <div className="flex px-6 items-center gap-2 mb-6">
      <CalendarViewTrigger className="aria-[current=true]:bg-accent" view="day">
        Day
      </CalendarViewTrigger>
      <CalendarViewTrigger
        view="week"
        className="aria-[current=true]:bg-accent"
      >
        Week
      </CalendarViewTrigger>
      <CalendarViewTrigger
        view="month"
        className="aria-[current=true]:bg-accent"
      >
        Month
      </CalendarViewTrigger>
      <CalendarViewTrigger
        view="year"
        className="aria-[current=true]:bg-accent"
      >
        Year
      </CalendarViewTrigger>

      <span className="flex-1" />

      <CalendarCurrentDate />

      <CalendarPrevTrigger>
        <ChevronLeft size={20} />
        <span className="sr-only">Previous</span>
      </CalendarPrevTrigger>

      <CalendarTodayTrigger>Today</CalendarTodayTrigger>

      <CalendarNextTrigger>
        <ChevronRight size={20} />
        <span className="sr-only">Next</span>
      </CalendarNextTrigger>

      <ModeToggle />
    </div>

    <div className="flex-1 overflow-auto px-6 relative">
      <CalendarDayView />
      <CalendarWeekView />
      <CalendarMonthView />
      <CalendarYearView />
    </div>
  </div>
</Calendar>
        </CardContent>
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
          {/* Toggle using Links to set the query parameter */}
          <Link href='?view=table'>
            <Button size='sm' className={viewMode === 'table' ? 'bg-primary' : 'bg-secondary'}>
              Table View
            </Button>
          </Link>
          <Link href='?view=calendar'>
            <Button size='sm' className={viewMode === 'calendar' ? 'bg-primary' : 'bg-secondary'}>
              Calendar View
            </Button>
          </Link>

          <Link href='/staff/jobs/create-event'>
            <Button size='sm' className='h-8 gap-1'>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Create Event</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Render the correct content based on the view mode from the query param */}
      {viewMode === 'table' ? (
        <>
          <TabsContent value='all'>{tableDisplay('all')}</TabsContent>
          <TabsContent value='active'>{tableDisplay('active')}</TabsContent>
          <TabsContent value='draft'>{tableDisplay('draft')}</TabsContent>
          <TabsContent value='disabled'>{tableDisplay('disabled')}</TabsContent>
        </>
      ) : (
        <>
          <TabsContent value='all'>{calendarDisplay('all')}</TabsContent>
          <TabsContent value='active'>{calendarDisplay('active')}</TabsContent>
          <TabsContent value='draft'>{calendarDisplay('draft')}</TabsContent>
          <TabsContent value='disabled'>{calendarDisplay('disabled')}</TabsContent>
        </>
      )}
    </Tabs>
  );
}
