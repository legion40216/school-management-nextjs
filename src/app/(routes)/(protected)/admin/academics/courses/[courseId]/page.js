import React from 'react';
import prisma from "@/lib/prismadb";
import CourseForm from './_components/course-form';

export default async function Page({ params }) {
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    }
  });

  const [
    grades, teachers
  ] = await Promise.all([
    prisma.grade.findMany({
      orderBy: { title: 'asc' }, 
      select: { id: true, title: true },
    }),
    prisma.teacher.findMany({
      orderBy: { name: 'asc' }, 
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div>
      <CourseForm
        initialData={course}
        grades={grades}
        teachers={teachers}
      />
    </div>
  );
}
