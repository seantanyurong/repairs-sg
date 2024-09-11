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


export default function Login() {
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
    password: z.string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      }),
    });
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
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
            <CardTitle>Login</CardTitle>
            <CardDescription>Login to your account to access our services.</CardDescription>
          </CardHeader>
          <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
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
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex space-y justify-between">
                <Button variant="link" onClick={() => router.push('/forgetPassword')}>Forget password?</Button>
                <Button variant="link" onClick={() => router.push('/register')}>Don&apos;t have an account?</Button>
              </div>
              <div className="flex justify-end mt-4">
                <Button type="submit">Login</Button>
              </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
