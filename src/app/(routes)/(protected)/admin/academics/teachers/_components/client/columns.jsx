"use client"

import CellActions from "@/components/table/cell-actions"
import CellLinks from "@/components/table/cell-links"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <CellLinks 
        dataId={row.original.id} 
        dataLabel={row.getValue("name")} 
        paramsName="students" 
      />
    ),
  },

  {
    accessorKey: "lastName",
    header: "Last Name",
  },

  {
    accessorKey: 'courseTitles',
    id: 'courseTitles',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <span>Course(s)</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 flex-wrap max-w-[200px]">
        {row.original.courseTitles.map((course) => (
          <Badge key={course.id} variant="secondary">
            {course.title}
          </Badge>
        ))}
      </div>
    )
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <CellActions
        dataId={row.original.id}
        paramsName="students"
        toastName="student"
      />
    ),
  },
];
