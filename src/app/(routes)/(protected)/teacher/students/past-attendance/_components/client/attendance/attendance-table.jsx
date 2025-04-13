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
import Link from "next/link"

export default function AttendanceTable({ 
  data,
}) {
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
            {data.length ? (
              data.map((item) => (
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
                    <Badge variant="secondary">
                        {item.status}
                      </Badge>
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
    </>
  )
}
