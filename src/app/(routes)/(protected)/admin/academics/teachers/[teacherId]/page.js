import React from 'react';
import prisma from "@/lib/prismadb";
import TeacherForm from './_components/teacher-form';
import AccountCreation from './_components/teacher-form/account-creation';

export default async function Page({ params }) {
  const { teacherId } = await params;

  const teacher = await prisma.teacher.findUnique({
    where: {
      id: teacherId,
    }
  });

  const formattedTeacher = teacher
    ? {
        ...teacher,
      }
    : null;

    console.log("formattedTeacher", formattedTeacher)
  return (
    <div className='space-y-8'>
      <TeacherForm
        initialData={formattedTeacher}
      />
      <AccountCreation 
        teacherId = {teacherId}
        initialData = {formattedTeacher}
      />
    </div>
  );
}
