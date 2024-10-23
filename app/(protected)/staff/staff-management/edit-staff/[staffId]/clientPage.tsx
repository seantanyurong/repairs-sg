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
import { Input } from "@/components/ui/input";
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
import { updateStaff } from "@/lib/actions/staff";
import { useUser } from "@clerk/nextjs";
import { PhoneInput } from "@/components/ui/phoneInput";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";

const staffSchema = z.object({
  id: z.string().min(1),
  imageUrl: z.string().min(1).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(["superadmin", "admin", "technician"]).optional(),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || isValidPhoneNumber(value), {
      message: "Invalid phone number",
    }),
});

export default function EditStaffClient({
  staff,
}: {
  staff: {
    id: string;
    imageUrl: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone: string;
  };
}) {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const form = useForm<z.infer<typeof staffSchema>>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      id: staff.id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      role: staff.role as "superadmin" | "admin" | "technician",
      phone: "",
    },
  });
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }
  if (user.id === staff.id) {
    router.push("/staff/staff-management");
  }
  console.log("role:", staff.role);

  const handlePopulatePhone = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (staff.phone === "") {
      toast("Staff does not currently have a phone number");
    }
    form.setValue("phone", staff.phone);
  };

  const onSubmit = async () => {
    setMessage("");
    setErrors({});
    console.log(form.getValues());
    const result = await updateStaff(form.getValues());
    if (result?.errors) {
      setMessage(result.message);
      setErrors(result.errors);
      return;
    } else {
      setMessage(result.message);
      form.reset(form.getValues());
      toast("Staff updated successfully");
      router.push("/staff/staff-management");
      router.refresh();
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
          name="id"
          render={({ field }) => {
            return (
              <FormItem hidden>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input placeholder="ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder={staff.firstName} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder={staff.lastName} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={staff.role}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a staff role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {user.publicMetadata.role === "superadmin" && (
                        <SelectItem value="superadmin">Superadmin</SelectItem>
                      )}
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <Button variant="link" onClick={(e) => handlePopulatePhone(e)}>
                  (use current)
                </Button>
                <FormControl>
                  <PhoneInput
                    placeholder={staff.phone}
                    {...field}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit" className="w-full">
          Update Staff
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
