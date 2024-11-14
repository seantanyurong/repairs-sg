'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
} from '@/components/ui/full-calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ModeToggle } from '@/components/ui/theme-toggle';
import { useEffect, useState } from 'react';
import JobDetails from './_components/JobDetails';

// Infer types from Mongoose models
export interface Job {
  _id: string;    
  service: string;
  quantity: number;
  address: number;               
  timeStart: Date;               
  timeEnd: Date;                 
  title: string;
  status: string;
  customer: string;                 
  staff: string;   
  vehicle: string;              
}

const showJobDetails = (event: Job, role: string) => {
    return (
    <JobDetails 
    _id={event._id}
    service={event.service}
    quantity={event.quantity}
    address={event.address}
    timeStart={event.timeStart}
    timeEnd={event.timeEnd}
    status={event.status}
    title={event.title}
    customer={event.customer}
    staff={event.staff}
    vehicle={event.vehicle}
    role={role}
  />
);
};

// optional to take in date
export default function CalendarClient({ filtersArray, jobs, role, date}: { filtersArray: string[]; jobs: Job[], role: string, date?: string}) {
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  useEffect(() => {

   console.log(filtersArray)

    if (filtersArray[0] === 'all') {
      setFilteredJobs(
        jobs.map((job) => {
          return {
            _id: job._id.toString(),
            service: job.service,
            quantity: job.quantity,
            address: job.address,
            timeStart:job.timeStart,
            timeEnd: job.timeEnd,
            title: job.title,
            status: job.status,
            customer: job.customer,
            staff: job.staff,
            vehicle: job.vehicle,
            color: 'blue',
          };
        }),
      );
    }

    if (filtersArray[0] !== 'all') {

      setFilteredJobs(jobs
      .filter((job) => filtersArray.includes(job.staff))
      .map((job) => {
        return {
          _id: job._id.toString(),
            service: job.service,
            quantity: job.quantity,
            address: job.address,
            timeStart:job.timeStart,
            timeEnd: job.timeEnd,
            title: job.title,
            status: job.status,
            customer: job.customer,
            staff: job.staff,
            vehicle: job.vehicle,
            color: 'blue',
        };
      }))
    }
  }, [filtersArray]);

  const isDayView = date ? true : false;
  // Converting DD/MM/YYYY date string to MM/DD/YYYY
  const formattedDate = date ? date.split('/').reverse().join('/') : '';
  

  const calendarDisplay = () => {
    return (
      <Card x-chunk='dashboard-06-chunk-0'>
        <CardHeader>
          <CardTitle>Scheduling</CardTitle>
          <CardDescription>Manage your job schedule Calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar 
          key={filteredJobs.map((job) => job._id).join(',')} 
          events={filteredJobs} 
          onEventClick={(event) => showJobDetails(event, role)} 
          {...(isDayView ? { defaultDate: new Date(formattedDate), view: 'day' } : {})}>
            <div className='h-dvh py-6 flex flex-col'>
              <div className='flex px-6 items-center gap-2 mb-6'>
                <CalendarViewTrigger className='aria-[current=true]:bg-accent' view='day'>
                  Day
                </CalendarViewTrigger>
                <CalendarViewTrigger view='week' className='aria-[current=true]:bg-accent'>
                  Week
                </CalendarViewTrigger>
                <CalendarViewTrigger view='month' className='aria-[current=true]:bg-accent'>
                  Month
                </CalendarViewTrigger>
                <CalendarViewTrigger view='year' className='aria-[current=true]:bg-accent'>
                  Year
                </CalendarViewTrigger>
                <span className='flex-1' />

                <CalendarCurrentDate />

                <CalendarPrevTrigger>
                  <ChevronLeft size={20} />
                  <span className='sr-only'>Previous</span>
                </CalendarPrevTrigger>

                <CalendarTodayTrigger>Today</CalendarTodayTrigger>

                <CalendarNextTrigger>
                  <ChevronRight size={20} />
                  <span className='sr-only'>Next</span>
                </CalendarNextTrigger>

                <ModeToggle />
              </div>

              <div className='flex-1 overflow-auto px-6 relative'>
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

  return <>{calendarDisplay()}</>;
}
