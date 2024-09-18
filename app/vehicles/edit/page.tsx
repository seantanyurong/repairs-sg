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

export default function EditVehicle() {
    const router = useRouter();
    // const [loading, setLoading] = useState(false);
    const vehicleSchema = z.object({
        plateNumber: z.string()
            .min(5, {
                message: "Plate must be at least 5 characters."
            }),
        gpsApi: z.string()
            .min(1, {
                message: "GPS API is required.",
            })
            .regex(/^(https?:\/\/)?([^\s@]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/, {
                message: "Please enter a valid URL",
            })
    });

    const form = useForm<z.infer<typeof vehicleSchema>>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            plateNumber: "", // get values from mongodb call
            gpsApi: "", // get values from mongodb call
        },
    })

    const onSubmit = async (values: z.infer<typeof vehicleSchema>) => {
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
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle>Update vehicle</CardTitle>
                        <CardDescription>Fill in details of the vehicle you would like to register.</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="flex flex-col gap-8">

                                <FormField
                                    control={form.control}
                                    name="plateNumber"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Vehicle Plate Number </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter plate number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gpsApi"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>GPS API</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter Traccar GPS API" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormMessage />
                            </CardContent>
                            <CardFooter className="flex justify-between mt-8">
                                <Button variant="outline" onClick={() => router.push('/vehicles')}>Back</Button>
                                <Button type="submit">Update</Button>
                            </CardFooter>
                        </form>
                    </Form>

                </Card>
            </main>
        </div>
    )
}