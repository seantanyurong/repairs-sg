"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@clerk/nextjs";
import JobRow from "./JobRow";
import { useEffect, useState } from "react";

// Infer types from Mongoose models
export interface Job {
  _id: string; // Converted to string
  jobAddress: string;
  service: string;
  schedule: {
    timeStart: Date; // Formatted date as a string
    timeEnd: Date; // Formatted date as a string
  };
  customer: string;
  staff: string; // Staff remains an array of strings
  status: string;
}

export interface Service {
  _id: string;
  name: string;
}

export interface Customer {
  _id: string;
  name: string;
}

export default async function WeeklyJob({
  jobs,
  services,
  customers,
}: {
  jobs: Job[];
  services: Service[];
  customers: Customer[];
}) {
  const { user, isLoaded } = useUser();
  const [userJobs, setUserJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (isLoaded && user) {
      // Get the current date
      const today = new Date();

      // Calculate the start of the week (Sunday)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      // Calculate the end of the week (Saturday)
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);

      // Filter jobs based on staff ID and whether the job is scheduled within this week
      const filteredJobs = jobs.filter((job) => {
        const jobDate = new Date(job.schedule.timeStart); // Convert timeStart to a Date object
        return (
          job.staff === user.id &&
          jobDate >= startOfWeek &&
          jobDate <= endOfWeek &&
          job.status !== "Completed"
        );
      });

      setUserJobs(filteredJobs);
      //   console.log("Filtered jobs:", filteredJobs); // Check if jobs are correctly filtered
    }
  }, [isLoaded, user, jobs]);

  if (!isLoaded) return <p>Loading...</p>;

  const jobRowDisplay = () => {
    return userJobs.map((job) => {
      const serviceId = job.service;
      const service = services.find((service) => service._id === serviceId);
      const serviceName = service ? service.name : "Unknown service";

      const customerId = job.customer;
      //   console.log("customer", customers);
      //   console.log("customerId", customerId);
      const customer = customers.find(
        (customer) => customer._id === customerId
      );
      const customerName = customer ? customer.name : "Unknow customer";

      return (
        <JobRow
          key={job._id.toString()}
          id={job._id.toString()}
          serviceName={serviceName}
          address={job.jobAddress}
          customerName={customerName}
          timeStart={job.schedule.timeStart.toLocaleString("en-GB")}
          timeEnd={job.schedule.timeEnd.toLocaleString("en-GB")}
        />
      );
    });
  };

  const jobTableDisplay = () => {
    return (
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Upcoming Jobs</CardTitle>
          <CardDescription>View your weekly job schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{jobRowDisplay()}</TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return <>{jobTableDisplay()}</>;
}
