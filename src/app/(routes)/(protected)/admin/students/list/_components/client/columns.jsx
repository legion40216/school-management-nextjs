"use client"

import CellActions from "@/components/table/cell-actions"
import CellLinks from "@/components/table/cell-links"
import { Badge } from "@/components/ui/badge";

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
    accessorKey: "fatherName",
    header: "Father's Name",
    cell: ({ row }) => <div>{row.getValue("fatherName")}</div>,
  },

  {
    accessorKey: "rollNo",
    header: "Roll No",
    cell: ({ row }) => <div>{row.getValue("rollNo")}</div>,
  },

  {
    accessorKey: "gradeTitle",
    header: "Grade",
    cell: ({ row }) =>             
      <Badge variant="secondary">
        {row.getValue("gradeTitle")}
      </Badge>,
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
        paramsName="list"
        toastName="student"
      />
    ),
  },
];
