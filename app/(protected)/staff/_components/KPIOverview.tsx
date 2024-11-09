import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DollarSign, Briefcase, NotepadText } from "lucide-react"; // Icons to represent revenue and jobs

export interface Invoice {
  invoiceId: number;
  customer: string;
  dateDue: Date;
  remainingDue: number;
}

export default async function KPIOverview({
  totalJobs,
  revenue,
  outstandingInvoices,
}: {
  totalJobs: number;
  revenue: number;
  outstandingInvoices: Invoice[];
}) {
  const outstandingBalance = outstandingInvoices.reduce((total, invoice) => {
    return total + invoice.remainingDue;
  }, 0);

  return (
    <>
      <CardTitle className="text-xl font-semibold mb-4">Monthly KPIs</CardTitle>
      <div className="flex flex-row gap-4">
        {/* Total Jobs Completed */}
        <Card className="w-full md:w-1/2 bg-white border rounded-lg shadow-md">
          <CardHeader className="flex items-center gap-2">
            <Briefcase className="text-green-500" size={24} />
            <CardTitle>Total Jobs Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-3xl font-bold text-center">
              {totalJobs}
            </CardDescription>
          </CardContent>
        </Card>

        {/* Revenue from Completed Jobs */}
        <Card className="w-full md:w-1/2 bg-white border rounded-lg shadow-md">
          <CardHeader className="flex items-center gap-2">
            <DollarSign className="text-green-500" size={24} />
            <CardTitle>Revenue from Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-3xl font-bold text-center">
              ${revenue.toLocaleString()}
            </CardDescription>
          </CardContent>
        </Card>

        {/* Number of Outstanding Invoices */}
        <Card className="w-full md:w-1/2 bg-white border rounded-lg shadow-md">
          <CardHeader className="flex items-center gap-2">
            <NotepadText className="text-red-500" size={24} />
            <CardTitle>Number of Outstanding Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-3xl font-bold text-center">
              {outstandingInvoices.length}
            </CardDescription>
          </CardContent>
        </Card>

        {/* Outstanding Balance */}
        <Card className="w-full md:w-1/2 bg-white border rounded-lg shadow-md">
          <CardHeader className="flex items-center gap-2">
            <DollarSign className="text-red-500" size={24} />
            <CardTitle>Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-3xl font-bold text-center">
              ${outstandingBalance.toLocaleString()}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
