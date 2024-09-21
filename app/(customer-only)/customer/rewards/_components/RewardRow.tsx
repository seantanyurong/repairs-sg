"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function RewardRow({
  id,
  rewardCode,
  status,
  // type,
  amount,
  expiryDate,
}: {
  id: string;
  rewardCode: string;
  status: string;
  // type: string;
  amount: number;
  expiryDate: string;
}) {
  const router = useRouter();

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
        <Button
          onClick={() => {
            router.push(`/customer/booking/${id}`);
            console.log("Clicked claim");
          }}
          className="cursor-pointer"
          disabled={true}
        >
          Details / Claim
        </Button>
      </TableCell>
    </TableRow>
  );
}
