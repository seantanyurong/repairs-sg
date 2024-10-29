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
import CustomerRow from "./_components/CustomerRow";
import { useEffect, useState } from "react";
import { User } from "@clerk/backend";
import { Input } from "@/components/ui/input";

export default function CustomerManagementClient({
  customerUsers,
}: {
  customerUsers: User[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomerUsers, setFilteredCustomerUsers] = useState<User[]>([]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  useEffect(() => {
    let customerUsersList = customerUsers?.map((customer) => customer) ?? [];
    if (searchQuery !== "") {
      customerUsersList = customerUsers?.filter((customer) =>
        customer.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    customerUsersList.sort((a, b) =>
      (a.firstName?.toLowerCase() as string).localeCompare(
        b.firstName?.toLowerCase() as string
      )
    );
    setFilteredCustomerUsers(customerUsersList);
  }, [searchQuery, customerUsers]);

  const customerDisplay = (role?: string) => {
    if (role === "all") {
      return filteredCustomerUsers.map((customer) => {
        return (
          <CustomerRow
            key={customer.id.toString()}
            id={customer.id.toString()}
            imageUrl={customer.imageUrl || ""}
            firstName={customer.firstName || ""}
            lastName={customer.lastName || ""}
            email={customer.emailAddresses[0].emailAddress || ""}
            role={(customer.publicMetadata.role as string) || ""}
            phone={(customer.unsafeMetadata.phone as string) || ""}
            // status={(customer.publicMetadata.status as string) || ""}
          />
        );
      });
    }

    // Filter by role
    return filteredCustomerUsers
      .filter((customer) => {
        const customerRole = customer.publicMetadata.role as string;
        return role?.toLowerCase() === customerRole;
      })
      .map((customer) => {
        return (
          <CustomerRow
            key={customer.id.toString()}
            id={customer.id.toString()}
            imageUrl={customer.imageUrl || ""}
            firstName={customer.firstName || ""}
            lastName={customer.lastName || ""}
            email={customer.emailAddresses[0].emailAddress || ""}
            role={(customer.publicMetadata.role as string) || ""}
            phone={(customer.unsafeMetadata.phone as string) || ""}
            // status={(customer.publicMetadata.status as string) || ""}
          />
        );
      });
  };

  const customerCount = (role?: string) => {
    if (role === "all") {
      return customerUsers.length;
    }

    return customerUsers.filter((customer) => {
      const customerRole = customer.publicMetadata.role as string;
      return role?.toLowerCase() === customerRole;
    }).length;
  };

  const cardDisplay = (role?: string) => {
    if (customerUsers.length === 0) {
      return <div className="mt-4">No {role} customer found</div>;
    }

    return (
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader className="flex flex-col sm:flex-row justify-between gap-2">
          <div>
            <CardTitle>Customer</CardTitle>
            <CardDescription className="mt-2">
              Manage customer and edit their details.
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
            <TableBody>{customerDisplay(role)}</TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {customerCount(role) === 0 ? "0" : "1"}-{customerCount(role)}
            </strong>{" "}
            of <strong>{customerCount(role)}</strong>
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
          <Link href="/customer/customer-management/create-customer">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Create Customer
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
