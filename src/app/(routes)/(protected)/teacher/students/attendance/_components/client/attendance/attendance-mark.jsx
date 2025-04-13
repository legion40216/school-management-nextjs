import { useEffect, useState } from "react"

import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
} from "@/components/ui/table"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"

export default function AttendanceMark({ 
  data, 
  courseId,
  gradeId,
  setAttendanceSheet,
  setAttendanceData 
}) {

  const [localData, setLocalData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Sync localData with data prop when it changes
  useEffect(() => {
    if (data) {
      setLocalData(data)
    }
  }, [data])


  const handleStatusChange = (id, newStatus) => {
    const updated = localData.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    )
    setLocalData(updated)
  }

  const toastMessage = "Attendance submitted successfully";
  const toastLoading = "Submitting attendance";
  const router = useRouter()

  const handleSubmit = async() => {
    const values = {
      gradeId:  gradeId,
      courseId: courseId,
      date:     new Date(),
      data:     localData
    }

    setIsLoading(true)
    const toastId = toast.loading(toastLoading); // Store the toastId
    try {
      const response = await axios.post(`/api/attendance`, values);
      toast.success(toastMessage);
      setAttendanceData(response.data.data || [])
      setLocalData([])
      setAttendanceSheet([])
      router.refresh()
    } 
    catch (error) {
      console.log(error)
      toast.error(error.response?.data?.error || "Something went wrong!");
    } finally {
      setIsLoading(false)
      toast.dismiss(toastId); // Dismiss loading toast in one place
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {["Name", "Roll-No", "Grade", "Course", "Date", "Status"].map((head, i) => (
                <TableHead key={i}>{head}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {localData.length ? (
              localData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Button 
                    variant="link" 
                    className="font-semibold" 
                    asChild
                    >
                      <Link href={`/dashboard/student/${item.student.id}`}                      >
                        {item.student.name}
                      </Link>
                    </Button>
                  </TableCell>

                  <TableCell>
                    {item.student.rollNo}
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">
                      {item.grade.title}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">
                      {item.course.title}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">
                      {item.date}
                      </Badge>
                  </TableCell>

                  <TableCell>
                    <RadioGroup
                      value={item.status}
                      onValueChange={(value) => handleStatusChange(item.id, value)}
                      className="flex gap-4"
                    >
                      {["PRESENT", "ABSENT", "LATE", "EXCUSED"].map((status) => (
                        <div 
                        key={status} 
                        className="flex items-center space-x-2"
                        >
                          <RadioGroupItem 
                          value={status} 
                          id={`${item.id}-${status}`} 
                          />
                          <label 
                          htmlFor={`${item.id}-${status}`} 
                          className="text-sm capitalize"
                          >
                            {status.toLowerCase()}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                colSpan={6} 
                className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {localData.length > 0 && (
        <Button 
        onClick={handleSubmit} 
        disabled={isLoading} 
        className="mt-4"
        >
          Submit Attendance
        </Button>
      )}
    </>
  )
}
