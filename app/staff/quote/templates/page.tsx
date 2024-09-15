import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns, QuoteTemplate } from "./columns";

const templates: QuoteTemplate[] = [];

const page = () => {
  return (
    <>
      <h1>Quote Templates</h1>
      <p>
        Quote templates are used to generate PDFs for quotes. You can create
        multiple templates and select the one you want to use when creating a
        quote.{" "}
      </p>
      <button>Create Template</button>
      <DataTable
        columns={columns}
        data={templates}
      />
    </>
  );
};

export default page;
