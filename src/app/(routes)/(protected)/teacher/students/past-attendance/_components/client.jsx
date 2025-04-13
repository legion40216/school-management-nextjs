"use client"
import React from 'react'
import Attendence from './client/attendance'
import { Separator } from '@/components/ui/separator'
import Headings from '@/components/custom-ui/headings'

export default function Client({grades}) {
  return (
    <div className="space-y-3">
        <div className="flex justify-between items-center">
            <Headings
            title={`Past Attendance`}
            discription={"Select a grade and course to view past attendance"}
            />
        </div>

        <Separator />

       <Attendence 
       grades={grades}
       />
  </div>
  )
}
