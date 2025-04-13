"use client"
import React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const attendanceSchema = z.object({
  gradeId: z.string().min(1,{
    message: "Please select a classroom."
  }),
  courseId: z.string().min(1,{
    message: "Please select a course."
  }),
  date: z.date({
    required_error: "Please select a date."
  })
});

export default function AttendanceForm({ grades, onSubmit }) {

  const form = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      gradeId: "",
      courseId: "",
      date: new Date(),
    }
  })

  const { isSubmitting } = form.formState;
  const selectedGradeId  = form.watch("gradeId")
  const selectedGrade    = grades.find(g => g.id === selectedGradeId)

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} 
        className="flex gap-3 items-end"
        >
          {/* Grade Field */}
          <FormField
            control={form.control}
            name="gradeId"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={(value) => {
                  field.onChange(value)
                  form.setValue("courseId", "") // reset course on grade change
                }} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade.id} value={grade.id}>{grade.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Course Field */}
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedGradeId}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {!selectedGrade?.courses?.length ? (
                      <SelectItem value="no-courses" disabled>No courses available</SelectItem>
                    ) : (
                      selectedGrade.courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover >
                  <PopoverTrigger asChild disabled>
                    <FormControl>
                      <Button variant="outline" 
                      className={cn("w-full text-left", !field.value && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
          <Button type="submit" disabled={isSubmitting}>
            Generate Attendance
          </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}