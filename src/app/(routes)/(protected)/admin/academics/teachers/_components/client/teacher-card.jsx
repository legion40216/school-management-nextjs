import React, { useState } from 'react'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import ConfirmModal from '@/components/modals/confirm-modal'

export default function TeacherCard({ item }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const onDelete = async () => {
    const toastId = toast.loading(`Deleting teacher`)
    try {
      await axios.delete(`/api/teachers/${item.id}`)
      toast.success('Teacher deleted')
      router.refresh()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!')
    } finally {
      toast.dismiss(toastId)
    }
  }

  const displayedCourses = item.courseTitles.slice(0, 3)
  const remainingCount = item.courseTitles.length - displayedCourses.length

  return (
    <Card className="relative shadow-sm border border-muted bg-white hover:shadow-md transition-all">
      {/* Dropdown and Delete Confirmation */}
      <div className="absolute top-2 right-2">
        <ConfirmModal onConfirm={onDelete} open={open} setOpen={setOpen} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(`/admin/academics/teachers/${item.id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Card Content */}
      <CardHeader>
        <CardTitle className="text-center text-lg font-semibold">
          {item.name} {item.lastName}
        </CardTitle>
        <CardDescription className="text-center text-sm text-muted-foreground">
          Teaching since: {item.createdAt}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-2">
        {item.courseTitles.length > 0 ? (
          <>
            {displayedCourses.map((course) => (
              <Badge key={course.id} variant="secondary">
                {course.title}
              </Badge>
            ))}
            {remainingCount > 0 && (
              <Badge variant="outline" className="text-muted-foreground">
                +{remainingCount} more
              </Badge>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No courses assigned</p>
        )}
      </CardContent>

      <CardFooter>
        <Link
          href={`/dashboard/browse/teachers/profile`}
          className={buttonVariants({ variant: 'default', className: 'w-full' })}
        >
          View Profile
        </Link>
      </CardFooter>
    </Card>
  )
}

