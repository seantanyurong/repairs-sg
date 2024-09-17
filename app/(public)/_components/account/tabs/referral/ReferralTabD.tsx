import React from "react";
import ReferralInfoSection from "./sections/ReferralInfoSectionD";
import RewardSection from "./sections/RewardSectionD";
import Divider from "@/components/ui/divider";

export default function ReferralTab() {
  return (
    <div>
      <h1 className="text-[1.0625rem] font-semibold pb-[-6px]">
        Referral and Rewards
      </h1>
      <Divider />
      <ReferralInfoSection />
      <Divider />
      <RewardSection />
    </div>
  );
}
