"use client"
import React, { useState } from 'react'
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
import ConfirmModal from '@/components/modals/confirm-modal'

export default function AccountCreation({
    teacherId,
    initialData
}) {        
        const form = useForm({
            resolver: zodResolver(registerSchema),
            defaultValues: {
                name: "",
                email: "",
                password: "",
                role: "TEACHER",
            },
            mode: "onChange"
        });
    
        const { isSubmitting } = form.formState
        const [open, setOpen] = useState(false);
        const router = useRouter()
    
        const onSubmit = async (values) => {
            const toastId = toast.loading('Creating your account...');
            try {
                const dataToSend = {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: values.role,
                };
                await axios.post(`/api/teachers/${teacherId}/register`, dataToSend);
                toast.success('Registration successful!');
                router.refresh()

            } catch (error) {
                console.log(error)
                // Show error toast
                toast.error(error.response?.data?.error || "Something went wrong!");
            }  finally {
                toast.dismiss(toastId); // Dismiss loading toast in one place
              }
        };


        const onDelete = async () => {
            const toastId = toast.loading("Deleting Teacher user account...");
            try {
             await axios.delete(`/api/teachers/${teacherId}/user/${initialData.userId}`)
             toast.success("Teacher user account deleted successfully.");
             setOpen(false);
             router.refresh()
            } catch (error) {
                console.log(error)
                toast.error(error.response?.data?.error || "Something went wrong!");
            } finally {
                toast.dismiss(toastId);
            }
          } 

  return (
    <div className=' rounded-md border space-y-3'>
    <div className=' border-b p-3'>
      <h2 className=' font-semibold'>Account creation</h2>
    </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-8 p-3'>
          {!initialData.userId ?
          <div className="grid md:grid-cols-2 gap-4">
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
          :
          <div>
            <h1 className=' text-xl text-center'>Account Already created</h1>
          </div>
          }
          <div className='flex justify-between items-center gap-2'> 
            {!initialData.userId &&
              <Button 
              type="submit"
              disabled={ isSubmitting }
              >
                Register teacher
              </Button>
            }
            {initialData.userId &&
            <div className=' ml-auto'>
              <ConfirmModal onConfirm={onDelete} open={open} setOpen={setOpen}>
                <Button
                    disabled={isSubmitting}
                    variant="destructive"
                    onClick={() => setOpen(true)}
                >
                  Delete Account
                </Button>
              </ConfirmModal>
            </div>
            }
          </div>
        </div>
      </form>
    </Form>
  </div>
  )
}
