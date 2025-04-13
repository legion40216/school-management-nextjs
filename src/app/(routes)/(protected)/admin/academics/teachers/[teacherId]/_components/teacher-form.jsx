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

import Headings from "@/components/custom-ui/headings";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/global-uI/image-upload";
import ConfirmModal from "@/components/modals/confirm-modal";

export const teacherSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Last name is required"),
  images: z
    .array(
      z.object({
        url: z.string().url("Invalid URL"),
      })
    )
    .min(1, "At least one image is required"),
});

export default function TeacherForm({ 
  initialData, 
}) {

  const form = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: initialData
    ? {
        name: initialData.name,
        lastName: initialData.lastName,
        images: initialData.teacherImages || [],
        courseId: initialData.courseId,
      }
    : {
        name: "",
        lastName: "",
        images: [],
      },
  });

  const title = initialData 
    ? "Edit Teacher" 
    : "Create Teacher";
  const desc = initialData
    ? "Edit the existing  teacher details"
    : "Add a new  teacher to your store";
  const toastMessage = initialData
    ? " Teacher updated successfully!"
    : " Teacher created successfully!";
  const toastLoading = initialData
    ? "Updating teacher..."
    : "Creating teacher...";
  const action = initialData 
    ? "Save Changes" 
    : "Create teacher";

  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { isSubmitting } = form.formState;

  const onSubmit = async (values) => {
    const toastId = toast.loading(toastLoading); // Store the toastId
    const processedData = { ...values };

    try {
      if (initialData) {
        await axios.patch(`/api/teachers/${params.studentId}`, processedData);
      } else {
        await axios.post(`/api/teachers`, processedData);
      }
      toast.success(toastMessage);
      router.push(`/admin/academics/teachers`);
      router.refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      toast.dismiss(toastId); // Dismiss loading toast in one place
    }
  };

  const onDelete = async () => {
    const toastId = toast.loading("Deleting teacher...");
    try {
      await axios.delete(`/api/teachers/${params.teacherId}`);
      toast.success("Teacher deleted successfully.");
      router.push(`/admin/academics/teachers`);
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

            <h2 className="text-lg font-semibold mb-4">Teacher Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter first name"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter last name"
                    disabled={isSubmitting}
                  />
                </FormControl>
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
