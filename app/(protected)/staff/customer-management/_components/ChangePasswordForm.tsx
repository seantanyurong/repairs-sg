"use client";
import { Button } from "@/components/ui/button";
import { CustomMenuButton } from "@/components/ui/customMenuButton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateStaff } from "@/lib/actions/staff";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const pwdSchema = z
  .object({
    id: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export default function ChangePasswordForm({ id }: { id: string }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof pwdSchema>>({
    resolver: zodResolver(pwdSchema),
    defaultValues: {
      id: id,
      password: "",
      confirmPassword: "",
    },
  });
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  const handleCancel = () => {
    form.reset();
  };
  const onSubmit = async () => {
    console.log("submit");
    console.log(form.getValues());
    const result = await updateStaff(form.getValues());
    if (result?.errors) {
      return;
    } else {
      toast("Staff password updated successfully");
      form.reset(form.getValues());
      router.refresh();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomMenuButton variant="ghost">Change Password</CustomMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to staff password here. Click change password to
            confirm.
          </DialogDescription>
        </DialogHeader>
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
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex justify-end">
              <DialogClose asChild>
                <Button className="mr-2" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </DialogClose>
              {/* <DialogClose> */}
              <Button type="submit">Change Password</Button>
              {/* </DialogClose> */}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
