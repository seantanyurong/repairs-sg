"use client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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


export default function ForgetPassword() {
  const router = useRouter();
  // const [loading, setLoading] = useState(false);
  const loginSchema = z.object({
    email: z.string()
      .min(1, {
        message: "Email is required.",
      })
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
        message: "Please enter a valid email address",
      }),
    });
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  })
  
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
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
          <CardTitle>Forget password</CardTitle>
          <CardDescription>Enter your email to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="flex flex-col gap-8" onSubmit={form.handleSubmit(onSubmit)}>
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
              <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => router.push('/login')}>Back</Button>
              {/* Add code to send reset password to email */}
              <Button type="submit">Send reset email</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  </div>
  )
}