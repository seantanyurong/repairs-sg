import {
  getJobs,
  getNumOfCompletedJobInMonthByStaff,
} from "@/lib/actions/jobs";
import WeeklyJob from "./_components/weeklyJob";
import { getServices } from "@/lib/actions/services";
import { getCustomers } from "@/lib/actions/customers";
import KPIOverview from "./_components/KPIOverview";
import { auth, clerkClient } from "@clerk/nextjs/server";

export default async function StaffHome() {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const jobs = await getJobs();
  const jobsMap = jobs.map((job) => ({
    _id: job._id.toString(),
    jobAddress: job.jobAddress,
    service: job.service.toString(),
    schedule: {
      timeStart: job.schedule.timeStart,
      timeEnd: job.schedule.timeEnd,
    },
    customer: job.customer,
    staff: job.staff,
    status: job.status,
  }));

  const services = await getServices();
  const servicesMap = services.map((service) => ({
    _id: service._id.toString(),
    name: service.name,
  }));

  const customers = await getCustomers();
  // console.log("page customer", customers);
  const customersMap = customers.data.map((customer) => ({
    _id: customer.id.toString(),
    name: `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim(),
  }));
  // console.log("customersMap", customersMap);

  const numOfCompletedJobInMonthByStaff =
    await getNumOfCompletedJobInMonthByStaff(userId);

  return (
    <div>
      <KPIOverview totalJobs={numOfCompletedJobInMonthByStaff} revenue={10} />
      <WeeklyJob
        jobs={jobsMap}
        services={servicesMap}
        customers={customersMap}
      />
    </div>
  );
}
