"use client"
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/modals/confirm-modal";
import { 
    Edit, 
    MoreHorizontal, 
    Trash2 
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CellActions({ 
  dataId,
  paramsName,
  toastName,
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onDelete = async () => {
    const toastId = toast.loading(`Deleting ${toastName}`);
    try {
      await axios.delete(`/api/${paramsName}/${dataId}`);
      toast.success(`${toastName.toUpperCase()} deleted`);
      router.refresh();
    }
    catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      toast.dismiss(toastId); // Dismiss loading toast in one place
      setOpen(false);
    } 
  };
  
  return (
    <>
    <ConfirmModal 
    onConfirm={onDelete} 
    open={open} 
    setOpen={setOpen} 
    />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={`${paramsName}/${dataId}`}
          >
              <Edit className="h-4 w-4 mr-2" />
              Update
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
  )
}
