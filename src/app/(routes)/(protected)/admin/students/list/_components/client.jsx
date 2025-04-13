"use client"
import React from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link';

import { Separator } from '@/components/ui/separator'
import Headings from '@/components/custom-ui/headings';
import { DataTable } from '@/components/table/data-table';
import { columns } from './client/columns';
import { buttonVariants } from '@/components/ui/button';

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
        <Link
          className={buttonVariants({  })}
          href={`list/new`}
        >
          <Plus className='h-4 w-4 mr-1'/>
          Add new
        </Link>
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
