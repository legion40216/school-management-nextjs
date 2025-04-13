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
import ImageUpload from "./student-form/image-upload";



export const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  rollNo: z.coerce.number().min(1, "Price must be greater than 0"),
  gradeId: z.string().min(1, "Grade is required"),
  images: z
    .array(
      z.object({
        url: z.string().url("Invalid URL"),
      })
    )
    .min(1, "At least one image is required"),
});

export default function StudentForm({ 
  initialData, 
  grades = [] 
}) {

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          fatherName: initialData.fatherName,
          rollNo: initialData.rollNo,
          gradeId: initialData.gradeId,
          images: initialData.studentImages || [],
        }
      : {
          name: "",
          fatherName: "",
          rollNo: "",
          gradeId: "",
          images: [],
        },
  });

  const title = initialData 
    ? "Edit Student" 
    : "Create Student";
  const desc = initialData
    ? "Edit the existing student details"
    : "Add a new student to your store";
  const toastMessage = initialData
    ? "Student updated successfully!"
    : "Student created successfully!";
  const toastLoading = initialData
    ? "Updating student..."
    : "Creating student...";
  const action = initialData 
    ? "Save Changes" 
    : "Create Student";

  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { isSubmitting } = form.formState;

  const onSubmit = async (values) => {
    const toastId = toast.loading(toastLoading); // Store the toastId
    const processedData = { ...values };

    try {
      if (initialData) {
        await axios.patch(`/api/students/${params.studentId}`, processedData);
      } else {
        await axios.post(`/api/students`, processedData);
      }
      toast.success(toastMessage);
      router.push(`/admin/students/list`);
      router.refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      toast.dismiss(toastId); // Dismiss loading toast in one place
    }
  };

  const onDelete = async () => {
    const toastId = toast.loading("Deleting student...");
    try {
      await axios.delete(`/api/students/${params.studentId}`);
      toast.success("Student deleted successfully.");
      router.push(`/admin/students/list`);
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
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((img) => img.url)}
                      disabled={isSubmitting || field.value.length >= 1}
                      onChange={(url) => {
                        const currentImages = form.getValues("images");
                        const newImage = { url: url };

                        if (currentImages.length < 3) {
                          const updatedImages = [...currentImages, newImage];
                          form.setValue("images", updatedImages, {
                            shouldValidate: true,
                          });
                        } else {
                          toast.error(
                            "You can only upload a maximum of 3 images."
                          );
                        }
                      }}
                      onRemove={(url) => {
                        const updatedImages = field.value.filter(
                          (current) => current.url !== url
                        );
                        form.setValue("images", updatedImages, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h2 className="text-lg font-semibold mb-4">Student Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Student name"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father's Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Father's name"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rollNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll No</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        placeholder="e.g. 12345"
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
                    <FormLabel>Grade</FormLabel>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
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
