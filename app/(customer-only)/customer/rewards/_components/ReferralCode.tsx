"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import copy from "clipboard-copy";

export default function ReferralCode({
  referralCodes,
}: {
  referralCodes: string[];
}) {
  const { user } = useUser();
  const referralCode = user?.unsafeMetadata.referralCode;
  const generateReferralCode = async () => {
    let newReferralCode = "";
    while (newReferralCode === "" || referralCodes.includes(newReferralCode)) {
      newReferralCode =
        "REF-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    }
    const result = await user?.update({
      unsafeMetadata: {
        referralCode: newReferralCode,
      },
    });
    console.log(result);
  };

  const handleCopy = async () => {
    const text =
      "Hey there! Please use my referral code: " +
      referralCode +
      " for your first booking to earn $15 off your next one!";
    try {
      await copy(text);
    } catch (error) {
      console.error("Failed to copy text to clipboard", error);
    }
  };

  return referralCode ? (
    <Button
      variant="outline"
      onClick={() => {
        handleCopy();
        toast("Referral code copied to clipboard");
      }}
      className="w-full h-auto"
    >
      <div className="flex flex-row lg:flex-col 2xl:flex-row items-center justify-between w-full">
        <p className="flex font-bold text-lg">{referralCode as string}</p>
        <p className="flex text-xs text-muted-foreground">Click to copy</p>
      </div>
    </Button>
  ) : (
    <Button
      variant="default"
      onClick={() => {
        generateReferralCode();
        toast("Referral code successfully generated");
      }}
      className="w-full h-auto"
    >
      <p className="text-wrap">Generate Referral Code</p>
    </Button>
  );
}
