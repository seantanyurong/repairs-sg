import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import copy from "clipboard-copy";
import { toast } from "sonner";
// import { useRouter } from "next/navigation";

export default function RewardDetail({
  rewardCode,
  amount,
  expiryDate,
}: {
  rewardCode: string;
  amount: number;
  expiryDate: string;
}) {
  // const router = useRouter();
  const date = new Date(expiryDate);
  const formattedDate = date.toISOString().split("T")[0];
  const handleCopy = async () => {
    try {
      await copy(rewardCode);
    } catch (error) {
      console.error("Failed to copy text to clipboard", error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="cursor-pointer">
          <div>Details</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Promo Code Details</DialogTitle>
          <DialogDescription>Claim your rewards today!</DialogDescription>
        </DialogHeader>
        <Separator />
        <p className="font-bold text-lg">${amount as number} discount for your next booking!</p>
        <p className="text-sm">Valid until: {formattedDate}</p>
        <Button
          variant="outline"
          onClick={() => {
            handleCopy();
            toast("Copied to clipboard");
          }}
        >
          <div className="flex items-center justify-between w-full">
            <p className="flex font-bold text-lg">{rewardCode}</p>
            <p className="flex text-xs text-muted-foreground">Click to copy</p>
          </div>
        </Button>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-bold">Terms and Conditions:</p>
          <p>1. Applicable for all Repair.sg services</p>
          <p>2. Cannot be used in conjunction with other promotions</p>
          <p>
            3. Reward codes are non-transferable and cannot be exchanged for
            cash
          </p>
          <p>4. Reward code must be used within the validity period</p>
          <p>
            5. In the event of booking cancellation, the reward code will be
            forfeited
          </p>
          <p>
            6. By using this reward code, you agree to abide by the terms and
            conditions outlined above
          </p>
        </div>
        <DialogFooter className="w-full">
          {/* <Button type="submit" className="cursor-pointer w-full" onClick={() => {
            router.push(`/customer/booking/${rewardCode}`);
          }}>
            Book Now
          </Button> */}
          <Button
            type="submit"
            className="cursor-pointer w-full"
            onClick={() => {
              console.log("Clicked book now");
            }}
          >
            Book Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
