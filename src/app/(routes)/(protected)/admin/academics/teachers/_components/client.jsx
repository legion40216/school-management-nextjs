"use client"
import React from 'react'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Headings from '@/components/custom-ui/headings';
import { DataTable } from '@/components/table/data-table';
import { columns } from './client/columns';
import TeacherCard from './client/teacher-card';


export default function Client({
  data
}) {
  const router = useRouter()
  
  return (
    <div className="space-y-3">
        <div className="flex justify-between items-center">
             <Headings
              title={`Teacher (${data.length})`}
              discription={"Manage teacher of your school"}
              />
              <Button onClick = {()=>{router.push(`teachers/new`)}}>
                  <Plus className='h-4 w-4 mr-1'/>
                      Add new
              </Button>
          </div>

        <Separator />

    <div className='grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3'> 
      {
      data.map((item)=>(
          <TeacherCard 
            key={item.id}
            item = {item}
          />
        ))
      }
      </div>
    </div>
  )
}
