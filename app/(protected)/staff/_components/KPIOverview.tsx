import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DollarSign, Briefcase } from "lucide-react"; // Icons to represent revenue and jobs

export default async function KPIOverview({
  totalJobs,
  revenue,
}: {
  totalJobs: number;
  revenue: number;
}) {
  return (
    <div className="flex flex-row gap-4">
      {/* Total Jobs Completed This Month */}
      <Card className="w-full md:w-1/2 bg-white border rounded-lg shadow-md">
        <CardHeader className="flex items-center gap-2">
          <Briefcase className="text-indigo-500" size={24} />
          <CardTitle>Total Jobs Completed This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-3xl font-bold">
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
          <CardDescription className="text-3xl font-bold">
            ${revenue.toLocaleString()}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
