"use client"
import React from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button'
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
            title={`Courses (${data.length})`}
            discription={"Manage Courses of your school"}
            />
            <Link
              className={buttonVariants({  })}
              href={`courses/new`}
            >
                <Plus className='h-4 w-4 mr-1'/>
                Add new
            </Link>
        </div>

        <Separator />

        <DataTable
          searchKey={"title"}
          columns={columns} 
          data={data}
        />
    </div>
  )
}
