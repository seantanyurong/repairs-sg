"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addQuoteTemplate,
  getOneQuoteTemplate,
  updateQuoteTemplate,
} from "@/lib/actions/quoteTemplates";
import { BLANK_PDF, cloneDeep, type Template } from "@pdfme/common";
import {
  barcodes,
  image,
  text,
  line,
  rectangle,
  ellipse,
  table,
} from "@pdfme/schemas";
import { Designer } from "@pdfme/ui";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface QuoteTemplateType {
  name: string;
  pdfTemplate: Template;
}

const Page = ({ params }: { params: { templateId?: string } }) => {
  const [templateName, setTemplateName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [existingTemplate, setExistingTemplate] =
    useState<QuoteTemplateType | null>(null);
  const designerRef = useRef<HTMLDivElement | null>(null);
  const designer = useRef<Designer | null>(null);
  const router = useRouter();

  const getTemplate = useCallback(async () => {
    if (params.templateId) {
      try {
        const template = JSON.parse(
          await getOneQuoteTemplate(params.templateId)
        );
        setExistingTemplate(template);
        setTemplateName(template.name);
        if (designer.current) {
          designer.current.updateTemplate(template.pdfTemplate);
        }
      } catch (e) {
        console.error(e);
        router.push("/staff/quote/templates");
        toast.error("Error fetching template: Please  try again.");
      }
    }
  }, [params.templateId, router]);

  useEffect(() => {
    // Designer requires Path2D, browser-specific API
    // Check to ensure NextJS does not pre render
    if (typeof window !== "undefined" && designerRef.current) {
      getTemplate();

      const template: Template = {
        basePdf: BLANK_PDF,
        schemas: [
          {
            name: {
              type: "text",
              content: "Quotation",
              position: {
                x: 25.06,
                y: 26.35,
              },
              width: 77.77,
              height: 18.7,
              fontSize: 36,
              fontColor: "#000000",
            },
          },
        ],
      };

      designer.current = new Designer({
        domContainer: designerRef.current,
        template,
        plugins: {
          Text: text,
          Table: table,
          Line: line,
          Rectangle: rectangle,
          Ellipse: ellipse,
          Image: image,
          QR: barcodes.qrcode,
        },
      });
    }
  }, [getTemplate]);

  const onChangeBasePDF = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      // convert file to dataUrl for pdfMe designer
      reader.onload = () => {
        const basePdf = reader.result;
        if (designer.current && basePdf) {
          designer.current.updateTemplate(
            Object.assign(cloneDeep(designer.current.getTemplate()), {
              basePdf,
            })
          );
        }
      };
    }
  };

  const onSaveTemplate = async (template?: Template) => {
    if (!templateName || templateName.length === 0) {
      setErrorMsg("Enter a template name");
      return;
    } else setErrorMsg("");

    if (designer.current) {
      const templateParams = {
        name: templateName,
        pdfTemplate: template || designer.current.getTemplate(),
      };

      const result =
        existingTemplate && params.templateId
          ? await updateQuoteTemplate(params.templateId[0], templateParams)
          : await addQuoteTemplate(templateParams);
      if (result.message === "Enter a template name") {
        setErrorMsg(result.message);
        return;
      } else {
        router.push("/staff/quote/templates");
        router.refresh();
        toast.success(result.message);
      }
    }
  };

  
  return (
    <div className="flex flex-col gap-2">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Add Quote Template
      </h1>
      <div className="flex flex-row gap-2 items-start">
        <div className="grid max-w-sm items-center gap-1.5">
          <Label htmlFor="templateName">Template Name</Label>
          <Input
            id="templateName"
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className={errorMsg ? "border-red-500" : ""}
          />
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        </div>
        <div className="grid max-w-sm items-center gap-1.5">
          <Label htmlFor="basePdf">Change Base PDF</Label>
          <Input
            id="basePdf"
            type="file"
            accept="application/pdf"
            onChange={onChangeBasePDF}
          />
        </div>
        <Button
          className="self-center ml-auto"
          onClick={() => onSaveTemplate()}
        >
          Save Template
        </Button>
      </div>
      <div
        id="container"
        ref={designerRef}
        className="w-full h-[calc(100vh-10rem)]"
      />
    </div>
  );
};

export default Page;
