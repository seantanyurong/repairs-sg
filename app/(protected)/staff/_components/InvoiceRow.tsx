import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

export default async function InvoiceRow({
  invoiceId,
  customerName,
  contact,
  dateDue,
  remainingDue,
}: {
  invoiceId: number;
  customerName: string;
  contact: string;
  dateDue: string;
  remainingDue: number;
}) {
  // Email template function
  const createEmailTemplate = (
    name: string,
    dueDate: string,
    amountDue: number
  ): string => {
    return `
      Dear ${name},

      We hope this message finds you well. This is a reminder that your payment was due by ${dueDate}.
      The remaining balance is $${amountDue.toFixed(2)}.

      Thank you for your attention to this matter.

      Best regards,
      Repair.sg
    `;
  };

  const handleEmailCustomer = () => {
    const subject = `Payment Reminder for Invoice #${invoiceId}`;
    const body = createEmailTemplate(customerName, dateDue, remainingDue);

    // mailto link to open email client
    const mailtoLink = `mailto:${contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  // Define color based on remainingDue
  const getBackgroundColor = () => {
    if (remainingDue > 500) {
      return "bg-red-300 hover: bg-red-300"; // High outstanding dues, red color
    } else if (remainingDue > 100) {
      return "bg-orange-300 hover:bg-orange-300"; // Medium outstanding dues, orange color
    } else {
      return "bg-green-300 hover:bg-green-300"; // Low outstanding dues, green color
    }
  };

  return (
    <TableRow className={getBackgroundColor()}>
      <TableCell className="font-medium">{invoiceId}</TableCell>
      <TableCell className="font-medium">{customerName}</TableCell>
      <TableCell className="font-medium">{contact}</TableCell>
      <TableCell className="font-medium">{dateDue}</TableCell>
      <TableCell className="font-medium">{remainingDue}</TableCell>
      <TableCell className="font-medium">
        <Button variant="outline" onClick={handleEmailCustomer}>
          Email Customer
        </Button>
      </TableCell>
    </TableRow>
  );
}
