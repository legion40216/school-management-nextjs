"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import AttendanceForm from './attendance/attendance-form'
import { format } from 'date-fns'
import AttendanceTable from './attendance/attendance-table'

export default function Attendence({ 
  grades,
}) {
  const [attendanceSheet, setAttendanceSheet] = useState([])

  const router = useRouter()
  const toastMessage = "Attendance fetched";
  const toastLoading = "Fetching attendance sheet";

  const onSubmit = async (values) => {
    const toastId = toast.loading(toastLoading); // Store the toastId

    try {
      const response = await axios.post(`/api/attendance/fetch`, values);
      toast.success(toastMessage);
      setAttendanceSheet(response.data.data || [])
      router.refresh();
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.error || "Something went wrong!");
    } finally {
      toast.dismiss(toastId); // Dismiss loading toast in one place
    }
  };
  
  const formattedAttendanceSheet= attendanceSheet.map((item) => ({
    id: `${item.studentId}-${item.date}`,
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
      <AttendanceForm
        grades={grades}
        onSubmit={onSubmit}
      />

      <AttendanceTable
      data={formattedAttendanceSheet}
      />
    </div>
  )
}