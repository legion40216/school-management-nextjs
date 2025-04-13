"use client"
import React from 'react'
import { Separator } from '@/components/ui/separator'
import Headings from '@/components/custom-ui/headings';
import { DataTable } from '@/components/table/data-table';
import { columns } from './client/columns';

export default function Client({
  data
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Headings
        title={`Student (${data.length})`}
        discription={"Manage student of your school"}
        />
      </div>

      <Separator />

      <DataTable
        searchKey={"name"}
        columns={columns} 
        data={data}
      />
    </div>
  )
}
