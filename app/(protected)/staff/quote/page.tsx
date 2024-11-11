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
import { getQuotations } from "@/lib/actions/quotations";
import { quotationColumns } from "./edit/[[...quotationId]]/_components/QuotationColumns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SearchParams = {
  tab?: string;
};

const Page = async ({searchParams} : {searchParams : SearchParams}) => {
  const quotations = await getQuotations();

  const tab = searchParams.tab === "accepted" ? "accepted" : "all";

  const cardDisplay = (validityStatus?: string) => {
    const filteredQuotations = quotations.filter((quotation) => {
      if (validityStatus === "all") return true;
      return quotation.status === validityStatus;
    });
    return (
      <CardContent>
        <DataTable
          columns={quotationColumns}
          data={JSON.parse(JSON.stringify(filteredQuotations))}
          noResultsMessage="No quotations found."
          filterColumn="name"
        />
      </CardContent>
    );
  };

  return (
    // tab should be either the quotationTab or active
    <Tabs defaultValue={tab}>
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl">
        Quotations
      </h1>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="declined">Declined</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
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
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Quotations</CardTitle>
            <CardDescription>
              Manage your quotations and edit their details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="all">{cardDisplay("all")}</TabsContent>
            <TabsContent value="draft">{cardDisplay("Draft")}</TabsContent>
            <TabsContent value="active">{cardDisplay("Active")}</TabsContent>
            <TabsContent value="accepted">
              {cardDisplay("Accepted")}
            </TabsContent>
            <TabsContent value="declined">
              {cardDisplay("Declined")}
            </TabsContent>
            <TabsContent value="expired">{cardDisplay("Expired")}</TabsContent>
          </CardContent>
        </Card>
      </div>
    </Tabs>
  );
};

export default Page;
