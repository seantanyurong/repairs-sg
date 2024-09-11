"use client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
// import { useState } from "react";

export default function Register() {
  const router = useRouter();
  // const [loading, setLoading] = useState(false);
  const authSchema = z.object({
    name: z.string()
      .min(2, {
        message: "Name must be at least 2 characters."
      }),
    email: z.string()
      .min(1, {
        message: "Email is required.",
      })
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
        message: "Please enter a valid email address",
      }),
    password: z.string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      }),
    confirmPassword: z.string()
      .min(8, {
        message: "Confirm Password must be at least 8 characters.",
      }),
    contact: z.string()
      .length(8, {
        message: "Contact must be exactly 8 digits.",
      })
      .regex(/^[89]\d{7}$/, {
        message: "Contact must start with 8 or 9 and be 8 digits long.",
      })
    }).superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
          path: ['confirmPassword']
        })
      }
    });
  
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      password: "",
      confirmPassword: ""
    },
  })
  
  const onSubmit = async (values: z.infer<typeof authSchema>) => {
    console.log(values);
    // try {
    //   setLoading(true);
    //   const res = await signIn('credentials', {
    //     redirect: false,
    //     username: values.username,
    //     password: values.password,
    //     callbackUrl,
    //   });
    //   setLoading(false);


    //   if (!res?.error) {
    //     router.push(callbackUrl);
    //   }

    //   const errorMessage = res?.error || 'Authentication error';
    //   console.log(errorMessage);
    //   setError('password', { type: 'manual', message: errorMessage });
    // } catch (error) {
    //   toast.error('Something went wrong.');
    // }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white">
    <header className="row-start-1 flex gap-6 flex-wrap items-center justify-center">
    <Button onClick={() => router.push('/')}>
          Home
      </Button>
    </header>
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Fill in your details to register an account.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col gap-8">
          
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your contact number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password again" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormMessage />
              </CardContent>
              <CardFooter className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => router.push('/login')}>Back</Button>
                <Button type="submit">Register</Button>
              </CardFooter>
            </form>
          </Form>
        
      </Card>
    </main>
  </div>
  )
}