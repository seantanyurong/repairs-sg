"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function JobDetails({
   _id,  
  service,
  quantity,
  address,
  timeStart,
  timeEnd,
  title,
  status,
  customer,
  staff,
  vehicle,
  role
}: {
  _id: string;    
  service: string;
  quantity: number;
  address: number;               
  timeStart: Date;               
  timeEnd: Date;                 
  title: string;
  status: string;
  customer: string;                 
  staff: string;   
  vehicle: string;  
  role: string;
}) {
  const router = useRouter();

  return (
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-4 items-center gap-4">
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Service
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {(service)}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Quantity
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {(quantity)}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Address
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {(address)}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Start Date
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {timeStart.toLocaleString('en-GB')}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              End Date
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {timeEnd.toLocaleString('en-GB')}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {(title)}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Status
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {(status)}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Customer
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {(customer)}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Staff
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {(staff)}
            </p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Vehicle
            </Label>
            <p className="text-sm text-muted-foreground col-span-3">
              {(vehicle)}
            </p>
          </div>
          {role === "admin" && (
              <Button
                onClick={() => router.push(`/staff/schedule/edit-job/${_id}`)}
              className='cursor-pointer'>
              Edit Job
              </Button>
          )}
        </div>
  );
}
