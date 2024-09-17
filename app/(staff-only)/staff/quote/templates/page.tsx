import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getQuoteTemplates } from "@/lib/actions/quoteTemplates";
import Link from "next/link";
import { columns } from "./columns";

const page = async () => {
  const templates = await getQuoteTemplates();
  console.log(templates);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Quote Templates
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Quote templates are used to generate PDFs for quotes. You can create
        multiple templates and select the one you want to use when creating a
        quote.{" "}
      </p>
      <Link
        className="self-end"
        href="/staff/quote/templates/edit"
      >
        <Button>Add Template</Button>
      </Link>
      <DataTable
        columns={columns}
        data={templates}
      />
    </div>
  );
};

export default page;
