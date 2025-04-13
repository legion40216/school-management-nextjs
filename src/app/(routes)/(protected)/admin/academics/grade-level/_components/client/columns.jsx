"use client"

import CellActions from "@/components/table/cell-actions"
import CellLinks   from "@/components/table/cell-links"
import { Badge }   from "@/components/ui/badge"
import { Button }  from "@/components/ui/button"

import { ArrowUpDown } from "lucide-react"

export const columns =  [
  {
    accessorKey: "title",
    header: "Title",
    id: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <span>Title</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => 
      <CellLinks 
      dataId    = {row.original.id} 
      dataLabel = {row.getValue("title")} 
      paramsName = {'grade-level'}
      /> 
  },

  {
    accessorKey: 'courseTitles',
    header: "Course(s)",
    cell: ({ row }) => {
      const courses = row.original.courseTitles;

      if (!courses || courses.length === 0) {
        return (
          <p className="text-sm text-muted-foreground">No courses assigned.</p>
        );
      }
  
      return (
        <div className="flex gap-2 flex-wrap max-w-[200px]">
          {courses.map((course) => (
            <Badge key={course.id} variant="secondary">
              {course.title}
            </Badge>
          ))}
        </div>
      );
    }
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
  },

  {
    id: "actions",
    cell: ({ row }) => 
    <CellActions
    dataId={row.original.id}
    paramsName="grade-level"
    toastName="grade"
    />,
  },
]
