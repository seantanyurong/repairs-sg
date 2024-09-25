import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { quotationColumns } from "./edit/_components/QuotationColumns";
import { getQuotations } from "@/lib/actions/quotations";

const Page = async () => {
  const quotations = await getQuotations();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl">
        Quotations
      </h1>
      <Link
        className="self-end"
        href="/staff/quote/edit"
      >
        <Button className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create Quotation
          </span>
        </Button>
      </Link>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Quotations</CardTitle>
          <CardDescription>
            Manage your quotations and edit their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={quotationColumns}
            data={JSON.parse(JSON.stringify(quotations))}
            noResultsMessage="No quotations found."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
