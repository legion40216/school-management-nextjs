"use client"
import React from 'react'
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from '@/components/ui/card'
import Link from 'next/link'
import axios from 'axios'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { registerSchema } from '@/schemas'
import { toast } from 'sonner'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RegisterForm() {
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "ADMIN",
        },
        mode: "onChange"
    });

    const { isSubmitting } = form.formState

    const onSubmit = async (values) => {
        const toastId = toast.loading('Creating your account...');
        try {
            const dataToSend = {
                name: values.name,
                email: values.email,
                password: values.password,
                role: values.role,
            };
            await axios.post(`/api/register/`, dataToSend);
            toast.success('Registration successful!');
            
            // Redirect after a short delay
            setTimeout(() => {
                router.push("/auth/login");
            }, 1000);
        } catch (error) {
            console.log(error)
            // Show error toast
            toast.error(error.response?.data?.error || "Something went wrong!");
        }  finally {
            toast.dismiss(toastId); // Dismiss loading toast in one place
          }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                    Create an account to get started
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <div className='flex justify-between'>
                                            <FormLabel>Name</FormLabel>
                                            <FormMessage/>
                                        </div>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="John Doe"
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <div className='flex justify-between'>
                                            <FormLabel>Email</FormLabel>
                                            <FormMessage/>
                                        </div>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="john.doe@example.com"
                                                type="email"
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <div className='flex justify-between'>
                                            <FormLabel>Password</FormLabel>
                                            <FormMessage/>
                                        </div>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="*****"
                                                type="password"
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Account Type</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                                disabled={isSubmitting}
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="ADMIN" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Administrator
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="TEACHER" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Teacher
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-3">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Registering..." : "Register"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="login" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}