import React from 'react';
import prisma from '@/lib/prismadb';
import { format } from 'date-fns';
import Client from './_components/client';

export default async function page() {
  const students = await prisma.student.findMany({
    include: {
      grade: true,
    },
  });

  const formattedStudents = students.map((item) => ({
    id: item.id,
    name: item.name,
    fatherName: item.fatherName,
    rollNo: item.rollNo,
    gradeTitle: item.grade.title,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div>
      <Client data={formattedStudents} />
    </div>
  );
}