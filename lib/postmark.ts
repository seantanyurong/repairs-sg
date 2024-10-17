"use server";

import * as postmark from "postmark";

const postmarkClient = new postmark.ServerClient(
  process.env.POSTMARK_API_KEY ?? ""
);

const sendQuoteEmailPostmark = async (
  to: string,
  subject: string,
  text: string,
  attachmentString: string
) => {
  console.log(to);

  return postmarkClient.sendEmail({
    From: "nevan@rstransport.com.sg", //TODO: Replace this
    To: "nevan@rstransport.com.sg", //TODO: Limitation of Dev Account on Postmark
    Subject: subject,
    TextBody: text,
    MessageStream: "outbound",
    Attachments: [
      {
        Name: "Quotation.pdf",
        ContentID: "quote",
        Content: attachmentString,
        ContentType: "application/pdf",
      },
    ],
  });
};

export { sendQuoteEmailPostmark };
