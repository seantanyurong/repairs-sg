"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import RewardDetail from "./RewardDetail";

export default function RewardRow({
  // id,
  rewardCode,
  status,
  amount,
  expiryDate,
}: {
  // id: string;
  rewardCode: string;
  status: string;
  amount: number;
  expiryDate: string;
}) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src="/images/placeholder.svg"
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{rewardCode}</TableCell>
      <TableCell>
        <Badge variant="outline">{status}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell font-medium">
        ${amount}
      </TableCell>
      <TableCell className="hidden md:table-cell">{expiryDate}</TableCell>
      <TableCell>
        {status === "ACTIVE" && (
          <RewardDetail
            rewardCode={rewardCode}
            amount={amount}
            expiryDate={expiryDate}
          />
        )}
      </TableCell>
    </TableRow>
  );
}
