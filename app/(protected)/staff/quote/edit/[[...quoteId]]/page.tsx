"use client";

import { Form } from "@pdfme/ui";
import { useEffect, useRef } from "react";
import { font, plugins, schemas } from "../../templates/_components/pdfSchema";
import { Template, BLANK_PDF } from "@pdfme/common";

const EditQuotation = () => {
  const uiRef = useRef<HTMLDivElement | null>(null);
  const ui = useRef<Form | null>(null);

  const buildUi = () => {
    const template: Template = {
      basePdf: BLANK_PDF,
      schemas,
    };

    if (uiRef.current) {
      ui.current = new Form({
        domContainer: uiRef.current,
        template,
        inputs: [
          {
            field1: "Quotation #",
            quote_date: "03/09/2024",
            customer_info:
              '{"customer_name":"CUSTOMER_NAME","company_name":"COMPANY_NAME","address_line1":"ADDRESS_LINE1","address_line2":"ADDRESS_LINE2","postal_code":"POSTAL_CODE"}',
            field6: "Repairs Pte.Ltd",
            field7:
              "229 Mountbatten Road\n#01-01 Mountbatten Square\nSingapore 398007",
            salesperson:
              '{"sales_email":"SALES_EMAIL","sales_mobile":"SALES_MOBILE"}',
            field11: '[["Transport Fee","1","$40.00"]]',
          },
        ],
        options: {
          font,
        },
        plugins,
      });
    }
  };

  useEffect(() => {
    buildUi();
  }, []);

  return (
    <>
      <div
        ref={uiRef}
        className="w-full h-[calc(100vh-10rem)]"
      />
    </>
  );
};

export default EditQuotation;
