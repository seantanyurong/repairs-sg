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
import { addLeave } from "@/lib/actions/leave";
import { DatePickerWithRange } from "@/components/ui/datePickerWithRange";
import { User } from "@clerk/backend";
import { Input } from "@/components/ui/input";

const leaveSchema = z.object({
  type: z.enum(["ANNUAL", "MC"]),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  dateRange: z.object({
    start: z.string().min(1),
    end: z.string().min(1),
  }),
  requesterId: z.string().min(1),
  approverId: z.string().min(1),
});

export default function CreateLeaveClient({
  approvers,
  userId,
}: {
  approvers: User[];
  userId: string;
}) {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const form = useForm<z.infer<typeof leaveSchema>>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      type: "ANNUAL",
      status: "PENDING",
      dateRange: {
        start: "",
        end: "",
      },
      requesterId: userId,
      approverId: "",
    },
  });

  const onSubmit = async () => {
    setMessage("");
    setErrors({});
    console.log(form.getValues());
    const result = await addLeave(form.getValues());
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
          Apply Leave
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
