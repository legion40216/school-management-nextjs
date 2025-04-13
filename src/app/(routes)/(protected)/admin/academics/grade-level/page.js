import React from 'react';
import prisma from '@/lib/prismadb';
import { format } from 'date-fns';
import Client from './_components/client';

export default async function page() {
  const grades = await prisma.grade.findMany({
    include: {
      courses: true,
    }
  });

  const formattedGrades = grades.map((item) => ({
    id:             item.id,
    title:          item.title,
    courseTitles: item.courses.map(course => ({
      id: course.id,
      title: course.title
    })),
    createdAt:      format(item.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div>
      <Client data={formattedGrades} />
    </div>
  );
}