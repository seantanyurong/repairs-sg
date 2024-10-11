"use client";

import { Template } from "@pdfme/common";
import { Viewer } from "@pdfme/ui";
import { useEffect, useRef } from "react";
import { font, plugins } from "../../templates/_components/pdfSchema";
import { Button } from "@/components/ui/button";

const EditQuotationClient = ({
  template,
  inputs,
}: {
  template: Template;
  inputs: Record<string, unknown>[];
}) => {
  const uiRef = useRef<HTMLDivElement | null>(null);
  const ui = useRef<Viewer | null>(null);

  useEffect(() => {
    const buildUi = () => {
      if (typeof window !== "undefined" && uiRef.current) {
        ui.current = new Viewer({
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
      <div className="flex lg:flex-row flex-col gap-2">
        <div className="flex flex-col lg:w-1/2 w-full">
          <p>To put in other info here</p>
          <div className="flex flex-row gap-2 ">
            <Button
              type="button"
              onClick={() => console.log("download")}
              variant="outline"
              className="w-auto"
            >
              Download PDF
            </Button>
            <Button
              type="button"
              onClick={() => console.log("send email")}
              variant="outline"
              className="w-auto"
            >
              Send Quote via Email
            </Button>
          </div>
        </div>
        <div
          ref={uiRef}
          className="lg:w-1/2 w-full h-[calc(100vh-10rem)]"
        ></div>
      </div>
    </>
  );
};

export default EditQuotationClient;
