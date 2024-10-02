"use client";

import { Template } from "@pdfme/common";
import { Form } from "@pdfme/ui";
import { useEffect, useRef } from "react";
import { font, plugins } from "../../templates/_components/pdfSchema";

const EditQuotationClient = ({
  template,
  inputs,
}: {
  template: Template;
  inputs: Record<string, unknown>[];
}) => {
  const uiRef = useRef<HTMLDivElement | null>(null);
  const ui = useRef<Form | null>(null);

  useEffect(() => {
    const buildUi = () => {
      if (typeof window !== "undefined" && uiRef.current) {
        ui.current = new Form({
          domContainer: uiRef.current,
          template,
          inputs,
          options: {
            font,
          },
          plugins,
        });
      }
    };
    buildUi();
  }, [inputs, template]);

  return (
    <>
      <div
        ref={uiRef}
        className="w-full h-[calc(100vh-10rem)]"
      />
    </>
  );
};

export default EditQuotationClient;
