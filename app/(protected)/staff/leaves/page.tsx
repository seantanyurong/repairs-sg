import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  getLeavesByApproverId,
  getLeavesByRequesterId,
} from "@/lib/actions/leave";
import { auth, clerkClient } from "@clerk/nextjs/server";
import LeaveRow from "./_components/LeaveRow";

export default async function Leaves() {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;
  const leavesRequested = await getLeavesByRequesterId(userId as string);
  const leavesToApprove = await getLeavesByApproverId(userId as string);

  const sortedLeavesRequested = leavesRequested.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const sortedLeavesToApprove = leavesToApprove.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const fetchUser = async (staffId: string) => {
    const actor = await clerkClient().users.getUser(staffId as string);
    return actor;
  };

  // To combined
  const leavesDisplay = async (status?: string, action?: string) => {
    const sortedLeaves =
      action === "leavesToApprove"
        ? sortedLeavesToApprove
        : sortedLeavesRequested;
    if (status === "all") {
      const leaves = await Promise.all(
        sortedLeaves.map(async (leave) => {
          const actor =
            action === "leavesToApprove"
              ? await fetchUser(leave.requesterId)
              : await fetchUser(leave.approverId);

          return (
            <LeaveRow
              key={leave._id.toString()}
              _id={leave._id.toString()}
              type={leave.type}
              status={leave.status}
              start={leave.dateRange?.start.toString()}
              end={leave.dateRange?.end.toString()}
              actor={JSON.parse(JSON.stringify(actor))}
              actorRole={
                action === "leavesToApprove" ? "requester" : "approver"
              }
              createdAt={leave.createdAt.toString()}
            />
          );
        })
      );
      return leaves;
    }

    // Filter by status
    const filteredLeaves = sortedLeaves.filter(
      (leave) => leave.status.toLowerCase() === status
    );

    const filteredLeavesRows = await Promise.all(
      filteredLeaves.map(async (leave) => {
        const actor =
          action === "leavesToApprove"
            ? await fetchUser(leave.requesterId)
            : await fetchUser(leave.approverId);

        return (
          <LeaveRow
            key={leave._id.toString()}
            _id={leave._id.toString()}
            type={leave.type}
            status={leave.status}
            start={leave.dateRange?.start.toString()}
            end={leave.dateRange?.end.toString()}
            actor={JSON.parse(JSON.stringify(actor))}
            actorRole={action === "leavesToApprove" ? "requester" : "approver"}
            createdAt={leave.createdAt.toString()}
          />
        );
      })
    );

    return filteredLeavesRows;
  };

  const leavesCount = (status?: string, action?: string) => {
    const leaves =
      action === "leavesToApprove" ? leavesToApprove : leavesRequested;
    if (status === "all") {
      return leaves.length;
    }

    return leaves.filter((leave) => leave.status.toLowerCase() === status)
      .length;
  };

  const leavesCardDisplay = (status?: string, action?: string) => {
    const leaves =
      action === "leavesToApprove" ? leavesToApprove : leavesRequested;
    const leaveDescription =
      action === "leavesToApprove"
        ? "Approve or reject leave requests and view their details."
        : "Manage your leave requests and edit their details.";
    const actorRole = action === "leavesToApprove" ? "Requester" : "Approver";

    if (leaves.length === 0) {
      return <div className="mt-4">No leave request found</div>;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
          <CardDescription>{leaveDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">Profile</TableHead>
                <TableHead>{actorRole}</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">
                  Start Date
                </TableHead>
                <TableHead className="hidden md:table-cell">End Date</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Requested On
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{leavesDisplay(status, action)}</TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {leavesCount(status, action) === 0
                ? "0"
                : `1-${leavesCount(status, action)}`}
            </strong>{" "}
            of <strong>{leavesCount(status, action)}</strong> leave requests
          </div>
        </CardFooter>
      </Card>
    );
  };

  const cardHeader = () => {
    return (
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2 mt-2">
          <Link href="/staff/leaves/create-leave">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Apply for leave
              </span>
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <Tabs defaultValue="leavesRequested">
      <TabsList>
        <TabsTrigger value="leavesRequested">My Requests</TabsTrigger>
        <TabsTrigger value="leavesToApprove">For Review</TabsTrigger>
      </TabsList>

      <TabsContent value="leavesRequested">
        <Tabs defaultValue="all">
          {cardHeader()}
          <TabsContent value="all">
            {leavesCardDisplay("all", "leavesRequested")}
          </TabsContent>
          <TabsContent value="pending">
            {leavesCardDisplay("pending", "leavesRequested")}
          </TabsContent>
          <TabsContent value="approved">
            {leavesCardDisplay("approved", "leavesRequested")}
          </TabsContent>
          <TabsContent value="rejected">
            {leavesCardDisplay("rejected", "leavesRequested")}
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="leavesToApprove">
        <Tabs defaultValue="all">
          {cardHeader()}
          <TabsContent value="all">
            {leavesCardDisplay("all", "leavesToApprove")}
          </TabsContent>
          <TabsContent value="pending">
            {leavesCardDisplay("pending", "leavesToApprove")}
          </TabsContent>
          <TabsContent value="approved">
            {leavesCardDisplay("approved", "leavesToApprove")}
          </TabsContent>
          <TabsContent value="rejected">
            {leavesCardDisplay("rejected", "leavesToApprove")}
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
