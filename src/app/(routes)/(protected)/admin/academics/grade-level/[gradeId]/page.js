import React from 'react';
import prisma from "@/lib/prismadb";
import GradeForm from './_components/grade-form';

export default async function Page({ params }) {
  const { gradeId } = await params;

  const grade = await prisma.grade.findUnique({
    where: {
      id: gradeId,
    }
  });

  return (
    <div>
      <GradeForm
        initialData={grade}
      />
    </div>
  );
}
