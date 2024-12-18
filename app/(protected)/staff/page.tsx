import {
  getCompletedJobInMonthByStaff,
  getJobsByStaffId,
} from "@/lib/actions/jobs";
import WeeklyJob from "./_components/WeeklyJob";
import { getServices } from "@/lib/actions/services";
import { getCustomers } from "@/lib/actions/customers";
import KPIOverview from "./_components/KPIOverview";
import { auth } from "@clerk/nextjs/server";
import {
  getOverdueInvoiceByStaffId,
  getRevenueGeneratingInvoiceFromJob,
} from "@/lib/actions/invoices";
import OutstandingInvoice from "./_components/OutstandInvoice";

export default async function StaffHome() {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  // KPI Overview
  const completedJobInMonthByStaff =
    await getCompletedJobInMonthByStaff(userId);

  console.log("completed job", completedJobInMonthByStaff);

  async function calculateTotalRevenue(
    completedJobInMonthByStaff: { _id: string }[]
  ) {
    const totalRevenue = (
      await Promise.all(
        completedJobInMonthByStaff.map(async (job) => {
          // Fetch the invoices for each job
          const invoices = await getRevenueGeneratingInvoiceFromJob(job._id);
          // Sum the totalAmount of all invoices for this job
          return invoices.reduce(
            (sum, invoice) => sum + invoice.totalAmount,
            0
          );
        })
      )
    ).reduce((sum, revenue) => sum + revenue, 0); // Sum up the revenues from each job

    return totalRevenue;
  }
  const totalRevenueInMonthByStaff = await calculateTotalRevenue(
    completedJobInMonthByStaff
  );

  // Outstanding Invoice
  const overdueInvoicesByStaff = await getOverdueInvoiceByStaffId(userId);
  const overdueInvoicesMap = overdueInvoicesByStaff.map((invoice) => ({
    invoiceId: invoice.invoiceId,
    customer: invoice.customer,
    dateDue: invoice.dateDue,
    remainingDue: invoice.remainingDue,
  }));
  console.log("overdue invoices", overdueInvoicesByStaff);

  // Weekly Job
  const jobs = await getJobsByStaffId(userId);
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
    email: customer.emailAddresses[0].emailAddress,
  }));
  // console.log("customersMap", customersMap);

  return (
    <div className="py-2">
      <div className="mb-4">
        <KPIOverview
          totalJobs={completedJobInMonthByStaff.length}
          revenue={totalRevenueInMonthByStaff}
          outstandingInvoices={overdueInvoicesMap}
        />
      </div>

      <div className="mb-4">
        <OutstandingInvoice
          invoices={overdueInvoicesMap}
          customers={customersMap}
        />
      </div>

      <WeeklyJob
        jobs={jobsMap}
        services={servicesMap}
        customers={customersMap}
      />
    </div>
  );
}
