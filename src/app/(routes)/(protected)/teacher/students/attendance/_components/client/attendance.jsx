"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import AttendanceForm from './attendance/attendance-form'
import { format } from 'date-fns'
import AttendanceMark from './attendance/attendance-mark'
import AttendanceTable from './attendance/attendance-table'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function Attendence({ 
  grades,
}) {
  const [attendanceSheet, setAttendanceSheet] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [gradeId, setGradeId]   = useState("")
  const [courseId, setCourseId] = useState("")

  const router = useRouter()
  const toastMessage = "Attendance generated";
  const toastLoading = "Generating attendance sheet";

  const onSubmit = async (values) => {
    const toastId = toast.loading(toastLoading); // Store the toastId
    setGradeId (values.gradeId)
    setCourseId(values.courseId)
    setDate    (format(new Date(values.date), "yyyy-MM-dd"))
    try {
      const response = await axios.post(`/api/attendance/generate`, values);
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

  const formattedAttendanceData = attendanceData.map((item) => ({
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
      <div className='flex justify-between items-center'>
        <AttendanceForm
          grades={grades}
          onSubmit={onSubmit}
        />
        <Link 
        className={buttonVariants({ variant: "outline" })} 
        href={`/teacher/students/past-attendance?courseId=${courseId}&classroomId=${gradeId}&date=${date}`}>
          View past attendance
        </Link>
      </div>


    {attendanceSheet.length > 0 ? (
      <AttendanceMark
        data={formattedAttendanceSheet}
        courseId={courseId}
        gradeId={gradeId}
        setAttendanceSheet={setAttendanceSheet}
        setAttendanceData={setAttendanceData}
      />
    ) : (
      <AttendanceTable
      data={formattedAttendanceData}
      />
    )
    }
    </div>
  )
}