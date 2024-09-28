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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { PhoneInput } from "@/components/ui/phoneInput";
import { isValidPhoneNumber } from "react-phone-number-input";

const formSchema = z.object({
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});

export default function PhoneForm({
  setIsEditing,
}: {
  setIsEditing: (isEditing: boolean) => void;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [errors, setErrors] = useState({});
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "+65",
    },
  });

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const onSubmit = async () => {
    setErrors({});
    setIsEditing(false);
    const result = await user.update({
      unsafeMetadata: {
        phone: form.getValues().phone,
      },
    });

    console.log(result);
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
        <Card className="flex flex-col w-full">
          <CardHeader>
            <CardTitle className="text-sm">Update Phone Number</CardTitle>
            <CardDescription>
              Please enter your updated phone number with the country code.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-between space-y-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="default" type="submit">
              Save
            </Button>
            {errors ? (
              <div className="mb-10 text-red-500">
                {Object.keys(errors).map((key) => (
                  <p key={key}>{`${key}: ${
                    errors[key as keyof typeof errors]
                  }`}</p>
                ))}
              </div>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
