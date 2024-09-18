import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { getQuoteTemplates } from "@/lib/actions/quoteTemplates";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { columns } from "./_components/QuoteTemplateColumns";

const page = async () => {
  const templates = await getQuoteTemplates();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-5xl">
        Quote Templates
      </h1>
      <Link
        className="self-end"
        href="/staff/quote/templates/edit"
      >
        <Button className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create Template
          </span>
        </Button>
      </Link>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Quote Templates</CardTitle>
          <CardDescription>
            Manage your quote templates and edit their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={JSON.parse(JSON.stringify(templates))}
            noResultsMessage="No quote templates found."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
