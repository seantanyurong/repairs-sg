import { getRewardsByUserId } from "@/lib/actions/rewards";
import { auth, clerkClient } from "@clerk/nextjs/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RewardRow from "./_components/RewardRow";
import ReferralCode from "./_components/ReferralCode";

export default async function Rewards() {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;
  const rewards = await getRewardsByUserId(userId as string);
  const users = await clerkClient().users.getUserList();
  const referralCodes = users.data.map(
    (user) => user.unsafeMetadata.referralCode
  );

  const rewardDisplay = (status?: string) => {
    if (status === "all") {
      return rewards.map((reward) => {
        return (
          <RewardRow
            key={reward._id.toString()}
            // id={reward._id.toString()}
            rewardCode={reward.rewardCode}
            status={reward.status}
            // type={reward.type}
            amount={reward.amount}
            expiryDate={reward.expiryDate.toString()}
          />
        );
      });
    }

    // Filter by status
    return rewards
      .filter((reward) => reward.status.toLowerCase() === status)
      .map((reward) => {
        return (
          <RewardRow
            key={reward._id.toString()}
            // id={reward._id.toString()}
            rewardCode={reward.rewardCode}
            status={reward.status}
            // type={reward.type}
            amount={reward.amount}
            expiryDate={reward.expiryDate.toString()}
          />
        );
      });
  };

  const rewardCount = (status?: string) => {
    if (status === "all") {
      return rewards.length;
    }

    return rewards.filter((reward) => reward.status.toLowerCase() === status)
      .length;
  };

  const cardDisplay = (status?: string) => {
    if (rewards.length === 0) {
      return <div className="mt-4">No rewards found</div>;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Rewards</CardTitle>
          <CardDescription>
            View your rewards and redeem them for discounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Reward Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Amount</TableHead>
                <TableHead className="hidden md:table-cell">
                  Valid Until
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{rewardDisplay(status)}</TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {rewardCount(status) === 0 ? "0" : "1"}-{rewardCount(status)}
            </strong>{" "}
            of <strong>{rewardCount(status)}</strong> rewards
          </div>
        </CardFooter>
      </Card>
    );
  };

  const referralCodeDisplay = () => {
    return (
      <div className="pt-0 lg:pt-11 w-full lg:w-[20%] order-1 lg:order-2">
        <Card className="lg:text-center lg:min-h-[275px]">
          <CardHeader>
            <CardTitle>Buddy Bonus!</CardTitle>
            <CardDescription>
              Invite your friends and earn rewards!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReferralCode referralCodes={referralCodes as string[]} />
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex w-full gap-4 flex-col lg:flex-row">
      <Tabs
        defaultValue="all"
        className="w-full lg:w-[80%] order-2 lg: order-1"
      >
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="claimed">Claimed</TabsTrigger>
            <TabsTrigger value="expired" className="hidden sm:flex">
              Expired
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all">{cardDisplay("all")}</TabsContent>
        <TabsContent value="active">{cardDisplay("active")}</TabsContent>
        <TabsContent value="claimed">{cardDisplay("claimed")}</TabsContent>
        <TabsContent value="expired">{cardDisplay("expired")}</TabsContent>
      </Tabs>
      {referralCodeDisplay()}
    </div>
  );
}
