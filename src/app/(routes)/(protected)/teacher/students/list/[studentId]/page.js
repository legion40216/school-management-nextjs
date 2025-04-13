import React from 'react';
import prisma from "@/lib/prismadb";
import StudentForm from './_components/student-form';

export default async function Page({ params }) {
  const { studentId } = await params;

  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
    include: {
      studentImages: true,
    },
  });

  const [
    grades,
  ] = await Promise.all([
    prisma.grade.findMany({
      orderBy: { title: 'asc' }, 
      select: { id: true, title: true },
    })
  ]);

  const formattedStudent = student
    ? {
        ...student,
      }
    : null;

  return (
    <div>
      <StudentForm
        initialData={formattedStudent}
        grades={grades}
      />
    </div>
  );
}
