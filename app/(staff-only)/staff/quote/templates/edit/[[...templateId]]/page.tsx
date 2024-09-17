"use client";

import React, { useEffect, useRef } from "react";
import { BLANK_PDF, cloneDeep, type Template } from "@pdfme/common";
import { Designer } from "@pdfme/ui";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Page = ({ params }: { params: { templateId?: string } }) => {
  const designerRef = useRef<HTMLDivElement | null>(null);
  const designer = useRef<Designer | null>(null);

  if (params.templateId) {
    console.log(params.templateId);
  }

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

  const onSaveTemplate = (template?: Template) => {
    if (designer.current) {
      // TODO: Save to MongoDB
      localStorage.setItem(
        "template",
        JSON.stringify(template || designer.current.getTemplate())
      );
      alert("Saved!");
    }
  };

  useEffect(() => {
    if (designerRef.current) {
      const template: Template = {
        basePdf: BLANK_PDF,
        schemas: [
          {
            name: {
              type: "text",
              content: "Pet Name",
              position: {
                x: 25.06,
                y: 26.35,
              },
              width: 77.77,
              height: 18.7,
              fontSize: 36,
              fontColor: "#14b351",
            },
          },
        ],
      };

      designer.current = new Designer({
        domContainer: designerRef.current,
        template,
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Add Quote Template
      </h1>
      <div className="flex flex-row justify-end gap-2 items-end">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="basePdf">Change Base PDF</Label>
          <Input
            id="basePdf"
            type="file"
            accept="application/pdf"
            onChange={onChangeBasePDF}
          />
        </div>
        <Button onClick={() => onSaveTemplate()}>Save Template</Button>
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
