"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import AttendanceForm from './attendance/attendance-form'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import AttendanceTable from './attendance/attendance-table'

export default function Attendence({ grades }) {
  const [attendanceData, setAttendanceData] = useState([])
  const router = useRouter()
  const toastMessage = "Attendance fetched";
  const toastLoading = "Fetching attendance records...";

  const onSubmit = async (values) => {
    const toastId = toast.loading(toastLoading); // Store the toastId
    try {
      const response = await axios.post("/api/attendance/fetch", values);
      toast.success(toastMessage);
      setAttendanceData(response.data.data || [])
      router.refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      toast.dismiss(toastId); // Dismiss loading toast in one place
    }
  };

  const formattedRecords = attendanceData.map((item) => ({
    id: item.id,
    date: format(new Date(item.date), "MMMM do, yyyy"),
    status: item.status,
    student: {
      id: item.student.id,
      name: item.student.name,
      rollNo: item.student.rollNo,
    },
    grade: {
      title: item.student.grade?.title || "Unknown",
    },
    course: {
      title: item.course.title,
    }
  }))

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
        <AttendanceForm
          grades={grades}
          onSubmit={onSubmit}
        />
        {formattedRecords.length > 0 && (
          <Button 
          className="mt-4"
          >
            Edit
          </Button>
        )}
      </div>

      <AttendanceTable
        data={formattedRecords}
      />
    </div>
  )
}