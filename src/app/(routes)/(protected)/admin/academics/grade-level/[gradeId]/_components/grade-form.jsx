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
import ConfirmModal from "@/components/modals/confirm-modal";

export const gradeSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export default function GradeForm({ 
  initialData, 
}) {

  const form = useForm({
    resolver: zodResolver(gradeSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
        }
      : {
          title: "",
        },
  });

  const title = initialData ? "Edit Grade" : "Create Grade";
  const desc = initialData
    ? "Edit the existing grade details"
    : "Add a new grade to your store";
  const toastMessage = initialData
    ? "Grade updated successfully!"
    : "Grade created successfully!";
  const toastLoading = initialData
    ? "Updating Grade..."
    : "Creating Grade...";
  const action = initialData ? "Save Changes" : "Create Grade";

  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { isSubmitting } = form.formState;

  const onSubmit = async (values) => {
    const toastId = toast.loading(toastLoading); // Store the toastId
    const processedData = { ...values };

    try {
      if (initialData) {
        await axios.patch(`/api/grades/${params.gradeId}`, processedData);
      } else {
        await axios.post(`/api/grades`, processedData);
      }
      toast.success(toastMessage);
      router.push(`/admin/academics/grade-level`);
      router.refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      toast.dismiss(toastId); // Dismiss loading toast in one place
    }
  };

  const onDelete = async () => {
    const toastId = toast.loading("Deleting grade...");
    try {
      await axios.delete(`/api/grades/${params.gradeId}`);
      toast.success("Grade deleted successfully.");
      router.push(`/admin/academics/grade-level`);
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
      
            <h2 className="text-lg font-semibold mb-4">Grade</h2>
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
                        placeholder="Grade Title"
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
