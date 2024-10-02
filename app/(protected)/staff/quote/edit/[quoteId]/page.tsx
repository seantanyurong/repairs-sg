import { getOneQuotation } from "@/lib/actions/quotations";
import { getOneQuoteTemplate } from "@/lib/actions/quoteTemplates";
import { getInputFromTemplate, Template } from "@pdfme/common";
import { QuoteTemplateType } from "../../templates/_components/QuoteTemplateColumns";
import EditQuotationClient from "./clientPage";
import dayjs from "dayjs";

const populateTemplate = (
  oldTemplate: Template,
  quotation: {
    quotationId: string;
    quotationDate: string | number | Date | dayjs.Dayjs | null | undefined;
    templateInputs: { [x: string]: string };
  }
): Template => {
  const updatedSchema = oldTemplate.schemas[0].map((field) => {
    switch (field.name) {
      case "quotation_no":
        return {
          ...field,
          content: `Quotation #${quotation.quotationId}`,
        };
      case "quote_date":
        return {
          ...field,
          content: dayjs(quotation.quotationDate).format("DD/MM/YYYY"),
        };
      case "customer_name":
        return {
          ...field,
          content: quotation.templateInputs["customer_name"],
        };
      case "sales_email":
        return {
          ...field,
          content: quotation.templateInputs["sales_email"],
        };
      default:
        return field;
    }
  });
  return {
    ...oldTemplate,
    schemas: [updatedSchema],
  };
};

const EditQuote = async ({ params }: { params: { quoteId: string } }) => {
  // const template: Template = {
  //   basePdf: BLANK_PDF,
  //   schemas,
  // };

  const quotation = JSON.parse(await getOneQuotation(params.quoteId));
  console.log(quotation);
  const quoteTemplate: QuoteTemplateType = JSON.parse(
    await getOneQuoteTemplate(quotation.quoteTemplate)
  );
  console.log(quoteTemplate);
  const updatedQuoteTemplate = populateTemplate(
    quoteTemplate.pdfTemplate,
    quotation
  );
  const inputs = getInputFromTemplate(updatedQuoteTemplate);

  console.log(inputs);
  return (
    <>
      <EditQuotationClient
        template={updatedQuoteTemplate}
        inputs={inputs}
      />
    </>
  );
};

export default EditQuote;
