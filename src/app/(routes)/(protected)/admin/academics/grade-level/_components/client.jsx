"use client"
import React from 'react'
import { Plus } from 'lucide-react'

import {  buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Headings from '@/components/custom-ui/headings';
import { DataTable } from '@/components/table/data-table';
import { columns } from './client/columns';
import Link from 'next/link';

export default function Client({
  data
}) {

  return (
    <div className="space-y-3">
        <div className="flex justify-between items-center">
             <Headings
              title={`Grade (${data.length})`}
              discription={"Manage Grade of your school"}
              />
              <Link
                className={buttonVariants({  })}
                href={`grade-level/new`}
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
