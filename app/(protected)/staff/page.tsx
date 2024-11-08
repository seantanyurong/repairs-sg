import { getJobs, getCompletedJobInMonthByStaff } from "@/lib/actions/jobs";
import WeeklyJob from "./_components/weeklyJob";
import { getServices } from "@/lib/actions/services";
import { getCustomers } from "@/lib/actions/customers";
import KPIOverview from "./_components/KPIOverview";
import { auth } from "@clerk/nextjs/server";

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

  const completedJobInMonthByStaff =
    await getCompletedJobInMonthByStaff(userId);

  console.log("completed job", completedJobInMonthByStaff);

  const totalRevenueInMonthByStaff = completedJobInMonthByStaff.reduce(
    (total, job) => {
      console.log("job", job.price);
      return total + job.price;
    },
    0
  );

  console.log("Total Revenue in Month by Staff:", totalRevenueInMonthByStaff);

  return (
    <div>
      <KPIOverview
        totalJobs={completedJobInMonthByStaff.length}
        revenue={totalRevenueInMonthByStaff}
      />
      <WeeklyJob
        jobs={jobsMap}
        services={servicesMap}
        customers={customersMap}
      />
    </div>
  );
}
