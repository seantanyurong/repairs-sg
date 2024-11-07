import { TableCell, TableRow } from "@/components/ui/table";
import { getCustomerName } from "@/lib/actions/customers";

export default async function JobRow({
  serviceName,
  address,
  timeStart,
  timeEnd,
  customerName,
}: {
  id: string;
  serviceName: string;
  address: string;
  timeStart: string;
  timeEnd: string;
  customerName: string;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{serviceName}</TableCell>
      <TableCell className="font-medium">{customerName}</TableCell>
      <TableCell className="font-medium">{address}</TableCell>
      <TableCell className="font-medium">{timeStart}</TableCell>
      <TableCell className="font-medium">{timeEnd}</TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}
