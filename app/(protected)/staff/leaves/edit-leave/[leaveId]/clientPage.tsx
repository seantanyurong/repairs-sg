"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { updateLeave } from "@/lib/actions/leave";
import { DatePickerWithRange } from "@/components/ui/datePickerWithRange";
import { User } from "@clerk/backend";
import { Input } from "@/components/ui/input";

const leaveSchema = z.object({
  _id: z.string().min(1),
  type: z.enum(["ANNUAL", "MC"]),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  dateRange: z
    .object({
      start: z.date().optional(),
      end: z.date().optional(),
    })
    .optional(),
  requesterId: z.string().min(1),
  approverId: z.string().min(1),
});

export default function EditLeaveClient({
  approvers,
  leave,
}: {
  approvers: User[];
  leave: {
    _id: string;
    type: string;
    status: string;
    dateRange: {
      start: Date;
      end: Date;
    };
    requesterId: string;
    approverId: string;
  };
}) {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const form = useForm<z.infer<typeof leaveSchema>>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      _id: leave._id.toString(),
      type: leave.type.toString() as "ANNUAL" | "MC",
      status: leave.status as "PENDING" | "APPROVED" | "REJECTED",
      dateRange: {
        start: leave.dateRange.start,
        end: leave.dateRange.end,
      },
      requesterId: leave.requesterId,
      approverId: leave.approverId,
    },
  });

  const onSubmit = async () => {
    setMessage("");
    setErrors({});
    console.log(form.getValues());
    const newLeave = {
      _id: form.getValues()._id,
      type: form.getValues().type,
      status: form.getValues().status,
      dateRange: {
        start: form.getValues().dateRange?.start || leave.dateRange.start,
        end: form.getValues().dateRange?.end || leave.dateRange.end,
      },
      requesterId: form.getValues().requesterId,
      approverId: form.getValues().approverId,
    };
    const result = await updateLeave(newLeave);
    if (result?.errors) {
      setMessage(result.message);
      setErrors(result.errors);
      return;
    } else {
      setMessage(result.message);
      router.refresh();
      form.reset(form.getValues());
      router.push("/staff/leaves");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }}
        className="max-w-md w-full flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="_id"
          render={({ field }) => {
            return (
              <FormItem hidden>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Leave Type</FormLabel>
                <Select onValueChange={field.onChange} {...field}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a leave type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ANNUAL">Annual</SelectItem>
                    <SelectItem value="MC">MC</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => {
            return (
              <FormItem hidden>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => {
            const { value, onChange } = field;
            const startDate = value?.start;
            const endDate = value?.end;
            return (
              <FormItem>
                <FormLabel>Date of Leave</FormLabel>
                <FormControl>
                  <DatePickerWithRange
                    startDate={startDate}
                    endDate={endDate}
                    onDateChange={({ start, end }) => {
                      onChange({ start, end });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="requesterId"
          render={({ field }) => {
            return (
              <FormItem hidden>
                <FormLabel>Requester</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="approverId"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Approver</FormLabel>
                <Select onValueChange={field.onChange} {...field}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an approver" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {approvers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.firstName + " " + staff.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type="submit" className="w-full">
          Edit Leave
        </Button>
        {message ? <h2>{message}</h2> : null}
        {errors ? (
          <div className="mb-10 text-red-500">
            {Object.keys(errors).map((key) => (
              <p key={key}>{`${key}: ${errors[key as keyof typeof errors]}`}</p>
            ))}
          </div>
        ) : null}
      </form>
    </Form>
  );
}
