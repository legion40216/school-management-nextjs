import React from 'react';
import prisma from '@/lib/prismadb';
import { format } from 'date-fns';
import Client from './_components/client';

export default async function page() {
  const teachers = await prisma.teacher.findMany({
    include: {
      courses: true,
    },
  });

  const formattedTeachers = teachers.map((item) => ({
    id:          item.id,
    name:        item.name,
    lastName:    item.lastName,
    courseTitles: item.courses.map(course => ({
      id: course.id,
      title: course.title
    })),
    createdAt:   format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div>
      <Client data={formattedTeachers} />
    </div>
  );
}