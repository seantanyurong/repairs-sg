import { Font } from "@pdfme/common";
import {
  barcodes,
  ellipse,
  image,
  line,
  multiVariableText,
  rectangle,
  table,
  text,
} from "@pdfme/schemas";

export const schemas = [
  [
    {
      name: "quotation_no",
      type: "text",
      content: "Quotation #",
      position: {
        x: 14.66,
        y: 14.75,
      },
      width: 78.6,
      height: 13.7,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 36,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto Bold",
    },
    {
      name: "quotation_date_label",
      type: "text",
      content: "Date",
      position: {
        x: 15.05,
        y: 33.25,
      },
      width: 13.78,
      height: 10,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto Bold",
    },
    {
      name: "for_label",
      type: "text",
      content: "For",
      position: {
        x: 15.31,
        y: 46.75,
      },
      width: 12.46,
      height: 10,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto Bold",
    },
    {
      name: "quote_date",
      type: "text",
      content: "03/09/2024",
      position: {
        x: 29.9,
        y: 33.25,
      },
      width: 45,
      height: 10,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto",
    },
    {
      name: "field6",
      type: "text",
      content: "Repairs Pte.Ltd",
      position: {
        x: 136.03,
        y: 32.83,
      },
      width: 45,
      height: 10,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto",
    },
    {
      name: "field7",
      type: "text",
      content:
        "229 Mountbatten Road\n#01-01 Mountbatten Square\nSingapore 398007",
      position: {
        x: 135.48,
        y: 44.71,
      },
      width: 63.78,
      height: 16.61,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto",
    },
    {
      name: "divider_upper",
      type: "line",
      position: {
        x: 16.55,
        y: 95.8,
      },
      width: 179.11,
      height: 0.73,
      rotate: 0,
      opacity: 1,
      readOnly: true,
      color: "#000000",
      required: false,
      content: "",
    },
    {
      name: "divider_lower",
      type: "line",
      position: {
        x: 16.23,
        y: 206.87,
      },
      width: 179.11,
      height: 0.73,
      rotate: 0,
      opacity: 1,
      readOnly: true,
      color: "#000000",
      required: false,
      content: "",
    },
    {
      name: "subtotal_label",
      type: "text",
      content: "Subtotal",
      position: {
        x: 129.57,
        y: 216.47,
      },
      width: 45,
      height: 10,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto Bold",
    },
    {
      name: "taxes_label",
      type: "text",
      content: "Taxes",
      position: {
        x: 129.31,
        y: 223.78,
      },
      width: 45,
      height: 10,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto Bold",
    },
    {
      name: "total_label",
      type: "text",
      content: "Total",
      position: {
        x: 129.33,
        y: 231.34,
      },
      width: 45,
      height: 10,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 16,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto Bold",
    },
    {
      name: "notes",
      type: "text",
      content: "Notes",
      position: {
        x: 16.55,
        y: 224.69,
      },
      width: 45,
      height: 10,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto Bold",
    },
    {
      name: "notes_desc",
      type: "text",
      content: "30 day payment terms",
      position: {
        x: 16.47,
        y: 231.61,
      },
      width: 53.47,
      height: 10,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto",
    },
    {
      name: "subtotal",
      type: "text",
      content: "$310.00",
      position: {
        x: 150.71,
        y: 216.45,
      },
      width: 45,
      height: 10,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto",
    },
    {
      name: "line_items",
      type: "table",
      position: {
        x: 16.12,
        y: 107.1,
      },
      width: 178.04,
      height: 29.172800000000002,
      content: '[["Transport Fee","1","$40.00"]]',
      showHead: true,
      head: ["Description", "Quantity", "Total"],
      headWidthPercentages: [60, 20, 20],
      tableStyles: {
        borderWidth: 0.3,
        borderColor: "#ffffff",
      },
      headStyles: {
        fontName: "Roboto Bold",
        fontSize: 13,
        characterSpacing: 0,
        alignment: "left",
        verticalAlignment: "middle",
        lineHeight: 1,
        fontColor: "#000000",
        borderColor: "",
        backgroundColor: "#ffffff",
        borderWidth: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        padding: {
          top: 5,
          right: 5,
          bottom: 5,
          left: 5,
        },
      },
      bodyStyles: {
        fontName: "Roboto",
        fontSize: 13,
        characterSpacing: 0,
        alignment: "left",
        verticalAlignment: "middle",
        lineHeight: 1,
        fontColor: "#000000",
        borderColor: "#888888",
        backgroundColor: "",
        alternateBackgroundColor: "#f5f5f5",
        borderWidth: {
          top: 0.1,
          right: 0.1,
          bottom: 0.1,
          left: 0.1,
        },
        padding: {
          top: 5,
          right: 5,
          bottom: 5,
          left: 5,
        },
      },
      columnStyles: {
        alignment: {
          "0": "left",
          "1": "left",
          "2": "left",
        },
      },
      required: false,
      readOnly: false,
    },
    {
      name: "taxes",
      type: "text",
      content: "$0.00",
      position: {
        x: 150.66,
        y: 223.79,
      },
      width: 45,
      height: 10,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto",
    },
    {
      name: "total_amount",
      type: "text",
      content: "$310.00",
      position: {
        x: 150.18,
        y: 232.47,
      },
      width: 45,
      height: 10,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto",
    },
    {
      name: "customer_name",
      type: "text",
      content: "Customer Name",
      position: {
        x: 29.6,
        y: 46.47,
      },
      width: 90,
      height: 7.62,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: false,
      fontName: "Roboto",
    },
    {
      name: "company_name",
      type: "text",
      content: "Company Name",
      position: {
        x: 29.6,
        y: 54.88,
      },
      width: 90,
      height: 7.62,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: false,
      fontName: "Roboto",
    },
    {
      name: "address_line_1",
      type: "text",
      content: "Address Line 1",
      position: {
        x: 29.6,
        y: 63.03,
      },
      width: 90,
      height: 7.62,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: false,
      fontName: "Roboto",
    },
    {
      name: "address_line_2",
      type: "text",
      content: "Address Line 2",
      position: {
        x: 29.6,
        y: 70.38,
      },
      width: 90,
      height: 7.62,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: false,
      fontName: "Roboto",
    },
    {
      name: "postal_code",
      type: "text",
      content: "Postal Code",
      position: {
        x: 29.6,
        y: 78.65,
      },
      width: 90,
      height: 7.62,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: false,
      fontName: "Roboto",
    },
    {
      name: "sales_mobile",
      type: "text",
      content: "sales_mobile",
      position: {
        x: 135.9,
        y: 63.78,
      },
      width: 60,
      height: 7.62,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: false,
      fontName: "Roboto",
    },
    {
      name: "sales_email",
      type: "text",
      content: "sales_email",
      position: {
        x: 136.11,
        y: 71.93,
      },
      width: 60,
      height: 7.62,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: false,
      fontName: "Roboto",
    },
    {
      name: "website",
      type: "text",
      content: "https://repair.sg",
      position: {
        x: 135.85,
        y: 79.6,
      },
      width: 45,
      height: 7.62,
      rotate: 0,
      alignment: "left",
      verticalAlignment: "top",
      fontSize: 13,
      lineHeight: 1,
      characterSpacing: 0,
      fontColor: "#000000",
      backgroundColor: "",
      opacity: 1,
      strikethrough: false,
      underline: false,
      required: false,
      readOnly: true,
      fontName: "Roboto",
    },
  ],
];

export const font: Font = {
  "Roboto Bold": {
    data: "http://localhost:3000/fonts/Roboto-Bold.ttf",
  },
  "Roboto Italic": {
    data: "http://localhost:3000/fonts/Roboto-Italic.ttf",
  },
  Roboto: {
    fallback: true,
    data: "http://localhost:3000/fonts/Roboto-Regular.ttf",
  },
};

export const plugins = {
  Text: text,
  "Multi-Variable Text": multiVariableText,
  Table: table,
  Line: line,
  Rectangle: rectangle,
  Ellipse: ellipse,
  Image: image,
  QR: barcodes.qrcode,
};
