"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import Headings from "@/components/custom-ui/headings";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ConfirmModal from "@/components/modals/confirm-modal";

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  gradeId: z.string().min(1, "Grade is required"),
  teacherId: z.string().min(1, "Teacher is required"),
});

export default function CourseForm({ 
  initialData, 
  grades = [],
  teachers = [],
}) {

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: initialData
      ? {
          title:      initialData.title,
          gradeId:    initialData.gradeId,
          teacherId:  initialData.teacherId,
        }
      : {
          title:      "",
          gradeId:    "",
          teacherId:  "",
        },
  });

  const title = initialData ? "Edit Course" : "Create Course";
  const desc = initialData
    ? "Edit the existing course details"
    : "Add a new course";
  const toastMessage = initialData
    ? "Course updated successfully!"
    : "Course created successfully!";
  const toastLoading = initialData
    ? "Updating Course..."
    : "Creating Course...";
  const action = initialData ? "Save Changes" : "Create Course";

  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { isSubmitting } = form.formState;

  const onSubmit = async (values) => {
    const toastId = toast.loading(toastLoading); // Store the toastId
    const processedData = { ...values };

    try {
      if (initialData) {
        await axios.patch(`/api/courses/${params.courceId}`, processedData);
      } else {
        await axios.post(`/api/courses`, processedData);
      }
      toast.success(toastMessage);
      router.push(`/admin/academics/courses`);
      router.refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      toast.dismiss(toastId); // Dismiss loading toast in one place
    }
  };

  const onDelete = async () => {
    const toastId = toast.loading("Deleting course...");
    try {
      await axios.delete(`/api/courses/${params.courceId}`);
      toast.success("Course deleted successfully.");
      router.push(`/admin/academics/courses`);
      router.refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      toast.dismiss(toastId); // Dismiss loading toast in one place
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <Headings title={title} description={desc} />
        {initialData && (
          <ConfirmModal onConfirm={onDelete} open={open} setOpen={setOpen}>
            <Button
              disabled={isSubmitting}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </ConfirmModal>
        )}
      </div>

      <Separator />

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      
            <h2 className="text-lg font-semibold mb-4">Course</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Cource Title"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                 <FormField
                  control={form.control}
                  name="gradeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grades</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select grades" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem key={grade.id} value={grade.id}>
                              {grade.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teachers</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select teachers" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            {/* Submit Button */}
            <div>
              <Button type="submit" disabled={isSubmitting}>
                {action}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
