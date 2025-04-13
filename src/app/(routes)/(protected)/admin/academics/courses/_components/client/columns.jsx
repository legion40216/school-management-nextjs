"use client"

import CellActions from "@/components/table/cell-actions"
import CellLinks from "@/components/table/cell-links"
import { Badge } from "@/components/ui/badge"

export const columns =  [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => 
      <CellLinks 
      dataId    = {row.original.id} 
      dataLabel = {row.getValue("title")} 
      paramsName = {'courses'}
      /> 
  },

  {
    accessorKey: "gradeTitle",
    header: "Grade Title",
    cell: ({ row }) => 
    <Badge variant="secondary">
      {row.getValue("gradeTitle")}
    </Badge>,
  },

  {
    accessorKey: "teacherName",
    header: "Teacher",
    cell: ({ row }) =>             
      <Badge variant="secondary">
        {row.getValue("teacherName")}
      </Badge>,
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
    paramsName="courses"
    toastName="courses"
    />,
  },
]
