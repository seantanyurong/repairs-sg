import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CalendarCurrentDate, CalendarDayView, CalendarMonthView, CalendarNextTrigger, CalendarPrevTrigger, CalendarTodayTrigger, CalendarViewTrigger, CalendarWeekView, CalendarYearView } from '@/components/ui/full-calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ModeToggle } from '@/components/ui/theme-toggle';
import { getJobs, getJobsForSchedule } from '@/lib/actions/jobs';
import { getStaff } from '@/lib/actions/staff';
import JobRow from './_components/JobRow';
import { DropdownMenuCheckboxes } from './_components/DropdownMenuCheckboxes';
import { getSchedules } from '@/lib/actions/schedules';


// type SearchParams = {
//   view?: string;
// };

export default async function Schedule({
  searchParams,
}: {
  // searchParams: SearchParams;
}) {
  // const jobs = await getJobsForSchedule();
  const jobs = await getJobs();
  console.log(jobs);
  const staff = await getStaff();
  const schedules = await getSchedules();
  console.log(schedules);
  const filters = searchParams.filters;
  const filtersArray = filters ? filters.split(",") : [];
  console.log(filtersArray);


  const jobTableDisplay = () => {
    if (jobs.length === 0) {
      return <div>No jobs found</div>;
    }

    // Filter by staff in filtersArray
    return jobs
      .filter((job) => filtersArray.includes(job.description))
      .map((job) => {
        return (
          <JobRow
            key={job._id.toString()}
            id={job._id.toString()}
            categoryType={job.categoryType}
            description={job.description}
            address={job.jobAddress.address}
            customerName={job.customer.fullName}
            // staffName={job.schedules.staff.fullName}
            staffName='PlaceHolder'
            timeStart={job.schedules.timeStart}
            timeEnd={job.schedules.timeEnd}
            status={job.status}
          />
        );
      });
  };

  const jobCalendarEvents = (status?: string) => {
    
    if (status === 'all') {
      return jobs;
    }
    // Filter by status
    return jobs
      .filter((job) => job.status.toLowerCase() === status);
  };

  const jobCount = (filtersArray: string[]) => {
    if (filtersArray.length === 0) {
      return jobs.length;
    }

    return jobs.filter((job) => filtersArray.includes(job.description)).length;
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

  const calendarDisplay = () => {
    return (
      <Card x-chunk='dashboard-06-chunk-0'>
        <CardHeader>
          <CardTitle>Scheduling</CardTitle>
          <CardDescription>Manage your job schedule Calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
          events={
            schedules
            .filter((schedule) => filtersArray.includes(schedule.staff))
            .map((schedule) => {
              return {
                _id: schedule._id.toString(),
                // timeStart: new Date('2024-08-26T09:30:00Z'),
                timeStart: new Date(schedule.timeStart),
                // timeEnd: new Date('2024-08-26T10:30:00Z'),
                timeEnd: new Date(schedule.timeEnd),
                title: schedule.title,
                staff: schedule.staff,
                color: 'blue',
              };
            })
            // {
            //   id: '1',
            //   start: new Date('2024-08-26T09:30:00Z'),
            //   end: new Date('2024-08-26T14:30:00Z'),
            //   title: 'event A',
            //   color: 'blue',
            // },
            // {
            //   id: '2',
            //   start: new Date('2024-08-26T10:00:00Z'),
            //   end: new Date('2024-08-26T10:30:00Z'),
            //   title: 'event B',
            //   color: 'blue',
            // },
            // {
            //   id: '3',
            //   start: new Date('2024-08-26T10:00:00Z'),
            //   end: new Date('2024-08-26T11:30:00Z'),
            //   title: 'event B',
            //   color: 'blue',
            // },

          }
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
    <Tabs defaultValue='calendar'>
      <div className='flex items-center'>
        <TabsList>
          <TabsTrigger value='table'>Table</TabsTrigger>
          <TabsTrigger value='calendar'>Calendar</TabsTrigger>
        </TabsList>
        <DropdownMenuCheckboxes 
                items={
                  staff.map((staff) => {
                    return {
                      fullName: staff.fullName,
                    };
                  })
                  }/>
        <div className='ml-auto flex items-center gap-2'>
          {/* <Link href='/staff/jobs/create-event'>
            <Button size='sm' className='h-8 gap-1'>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Create Event</span>
            </Button>
          </Link> */}
        </div>
      </div>
          <TabsContent value='calendar'>{calendarDisplay()}</TabsContent>
          <TabsContent value='table'>{tableDisplay()}</TabsContent>
    </Tabs>
  );
}
