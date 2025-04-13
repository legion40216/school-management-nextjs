// "use client"
// import React, { useEffect, useState } from 'react'
// import { useForm } from "react-hook-form"
// import { format } from "date-fns"
// import { CalendarIcon } from "lucide-react"
// import { cn } from "@/lib/utils"

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form"

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"

// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Input } from '@/components/ui/input'

// export default function AttendenceForm({
//     grades,
//     onSubmit
// }) {
//     const [selectedGrade, setSelectedGrade] = useState();
   
//     const form = useForm({
//         defaultValues:{
//           search: "",  
//           gradeId: "",
//           courseId: "",
//           date:{ 
//             from: "",
//             to: ""
//           }
//         }
//       })  

//       useEffect(()=>{
//         form.setValue("courseId","")
//         const selectedGradeId = form.getValues("gradeId");
//         const foundGrade = grades.find((grade) => grade.id === selectedGradeId);
//         setSelectedGrade(foundGrade)
//       },[form.watch("gradeId")])

//   return (
//    <Form {...form}>
//     <form onSubmit={form.handleSubmit(onSubmit)}>
//       <div className='flex flex-wrap gap-4'>
//         <FormField
//           control = {form.control}
//           name = "search"
//           render = {({field}) => 
//           <FormItem>
//             <FormControl>
//               <Input
//                   {...field}
//                   placeholder="Search anything"
//                 />
//             </FormControl>
//             <FormMessage/>
//           </FormItem>
//           }
//         />

//         <FormField
//         control={form.control}
//         name="gradeId"
//         render={({ field }) => (
//           <FormItem>
//             <Select onValueChange={field.onChange} defaultValue={field.value}>
//               <FormControl>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select grade" />
//                 </SelectTrigger>
//               </FormControl>
//               <SelectContent>
//                 {
//                 grades.map((grade)=>(
//                 <SelectItem key={grade.id} value={grade.id}>
//                 {grade.title}
//                 </SelectItem>
//                 ))    
//                 }
//               </SelectContent>
//             </Select>
//             <FormMessage />
//           </FormItem>
//         )}
//         />

//         <FormField
//         control={form.control}
//         name="courseId"
//         render={({ field }) => (
//           <FormItem>
//             <Select 
//             value={field.value}
//             onValueChange={field.onChange} defaultValue={field.value}
//             >
//               <FormControl>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select course" />
//                 </SelectTrigger>
//               </FormControl>
//               <SelectContent>
//                 {/* Updated logic here */}
//                 {!selectedGrade || !selectedGrade.courses.length ? (
//                   <SelectItem key="no-courses" value="no-courses">
//                     No courses available for this classroom.
//                   </SelectItem>
//                 ) : (
//                   selectedGrade.courses.map((course) => (
//                     <SelectItem key={course.id} value={course.id}>
//                       {course.title}
//                     </SelectItem>
//                   ))
//                 )}
//               </SelectContent>
//             </Select>
//             <FormMessage />
//           </FormItem>
//         )}
//         />

//         <FormField
//         control={form.control}
//         name="date"
//         render={({ field }) => (
//           <FormItem className="flex flex-col">
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                 variant={"outline"}
//                 className={cn(
//                 "w-[300px] justify-start text-left font-normal",
//                 !field.value && "text-muted-foreground"
//                 )}
//                 >
//                 <CalendarIcon className="mr-2 h-4 w-4" />
//                 {field.value?.from ? (
//                 field.value.to ? (
//                 <>
//                 {format(field.value.from, "LLL dd, y")} -{" "}
//                 {format(field.value.to, "LLL dd, y")}
//                 </>
//                 ) : (
//                 format(field.value.from, "LLL dd, y")
//                 )
//                 ) : (
//                 <span>Pick a date</span>
//                 )}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                 initialFocus
//                 mode="range"
//                 defaultMonth={field.value?.from}
//                 selected={field.value}
//                 onSelect={field.onChange}
//                 />
//               </PopoverContent>
//             </Popover>
//             <FormMessage />
//           </FormItem>
//         )}
//         />

//         <Button 
//         type="submit"
//         disabled={form.formState.isSubmitting}
//         >
//           Find
//         </Button>
//       </div>
//     </form>
//   </Form>
//   )
// }

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
  FormLabel,
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
import { Input } from '@/components/ui/input'

export default function AttendanceForm({ grades, onSubmit }) {

  const form = useForm({
    defaultValues: {
      search: "",  
      gradeId: "",
      courseId: "",
      date: ""
    }
  })
  const { isSubmitting } = form.formState;
  const selectedGradeId = form.watch("gradeId")
  const selectedGrade = grades.find(g => g.id === selectedGradeId)

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} 
        className="flex gap-3 items-end"
        >
        {/* Search Field */}
        <FormField
          control = {form.control}
          name = "search"
          render = {({field}) => 
          <FormItem>
            <FormControl>
              <Input
                  {...field}
                  placeholder="Search anything"
                />
            </FormControl>
            <FormMessage/>
          </FormItem>
          }
        />
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
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button 
              variant="outline" 
              className={cn(
                "w-full text-left",
                !field.value && "text-muted-foreground"
              )}
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
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )}
/>

          <div>
          <Button type="submit" disabled={isSubmitting}>
            Get Attendance
          </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}