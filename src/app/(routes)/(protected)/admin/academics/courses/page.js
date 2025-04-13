import React from 'react';
import prisma from '@/lib/prismadb';
import { format } from 'date-fns';
import Client from './_components/client';

export default async function page() {
  const courses = await prisma.course.findMany({
    include: {
      teacher: true,
      grade:   true,
    },
  });

  const formattedCourses = courses.map((item) => ({
    id:             item.id,
    title:          item.title,
    gradeTitle:     item.grade.title,
    teacherName:    item.teacher.name,
    createdAt:      format(item.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div>
      <Client data={formattedCourses} />
    </div>
  );
}
