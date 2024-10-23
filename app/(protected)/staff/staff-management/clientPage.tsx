/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import StaffRow from "./_components/StaffRow";
import { useEffect, useState } from "react";
import { User } from "@clerk/backend";
import { Input } from "@/components/ui/input";

export default function StaffManagementClient({
  staffUsers,
}: {
  staffUsers: User[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStaffUsers, setFilteredStaffUsers] = useState<User[]>([]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  useEffect(() => {
    let staffUsersList = staffUsers?.map((staff) => staff) ?? [];
    if (searchQuery !== "") {
      staffUsersList = staffUsers?.filter((staff) =>
        staff.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    staffUsersList.sort((a, b) =>
      (a.firstName?.toLowerCase() as string).localeCompare(
        b.firstName?.toLowerCase() as string
      )
    );
    setFilteredStaffUsers(staffUsersList);
  }, [searchQuery, staffUsers]);

  const staffDisplay = (role?: string) => {
    if (role === "all") {
      return filteredStaffUsers.map((staff) => {
        return (
          <StaffRow
            key={staff.id.toString()}
            id={staff.id.toString()}
            imageUrl={staff.imageUrl || ""}
            firstName={staff.firstName || ""}
            lastName={staff.lastName || ""}
            email={staff.emailAddresses[0].emailAddress || ""}
            role={(staff.publicMetadata.role as string) || ""}
            phone={(staff.unsafeMetadata.phone as string) || ""}
            // status={(staff.publicMetadata.status as string) || ""}
          />
        );
      });
    }

    // Filter by role
    return filteredStaffUsers
      .filter((staff) => {
        const staffRole = staff.publicMetadata.role as string;
        return role?.toLowerCase() === staffRole;
      })
      .map((staff) => {
        return (
          <StaffRow
            key={staff.id.toString()}
            id={staff.id.toString()}
            imageUrl={staff.imageUrl || ""}
            firstName={staff.firstName || ""}
            lastName={staff.lastName || ""}
            email={staff.emailAddresses[0].emailAddress || ""}
            role={(staff.publicMetadata.role as string) || ""}
            phone={(staff.unsafeMetadata.phone as string) || ""}
            // status={(staff.publicMetadata.status as string) || ""}
          />
        );
      });
  };

  const staffCount = (role?: string) => {
    if (role === "all") {
      return staffUsers.length;
    }

    return staffUsers.filter((staff) => {
      const staffRole = staff.publicMetadata.role as string;
      return role?.toLowerCase() === staffRole;
    }).length;
  };

  const cardDisplay = (role?: string) => {
    if (staffUsers.length === 0) {
      return <div className="mt-4">No {role} staff found</div>;
    }

    return (
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader className="flex flex-col sm:flex-row justify-between gap-2">
          <div>
            <CardTitle>Staff</CardTitle>
            <CardDescription>
              Manage staff and edit their details.
            </CardDescription>
          </div>
          <div className="flex flex-col w-full sm:w-[30%] gap-1">
            <Input
              placeholder="Search by first name"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden md:table-cell">
                  Phone Number
                </TableHead>
                {/* <TableHead className="hidden md:table-cell">
                  Status
                </TableHead> */}
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{staffDisplay(role)}</TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {staffCount(role) === 0 ? "0" : "1"}-{staffCount(role)}
            </strong>{" "}
            of <strong>{staffCount(role)}</strong>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="superadmin">Superadmin</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="technician" className="hidden sm:flex">
            Technician
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/staff/staff-management/create-staff">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Create Staff
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent value="all">{cardDisplay("all")}</TabsContent>
      <TabsContent value="superadmin">{cardDisplay("superadmin")}</TabsContent>
      <TabsContent value="admin">{cardDisplay("admin")}</TabsContent>
      <TabsContent value="technician">{cardDisplay("technician")}</TabsContent>
    </Tabs>
  );
}
