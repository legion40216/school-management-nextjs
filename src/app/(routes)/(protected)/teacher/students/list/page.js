import React from 'react';
import Client from './_components/client';
import { currentUser } from '@/hooks/server-auth-utils';
import { checkRoleAndRedirect } from '@/hooks/use-redirect-role';
import { unauthorized } from 'next/navigation';
import prisma from '@/lib/prismadb';
import { format } from 'date-fns';

export default async function page() {
  const user = await currentUser();

  // Check if the user is authenticated
  if (!user) {
    return unauthorized("Access restricted: Teacher account required");
  }

  // Check if the user has a teacher role
  await checkRoleAndRedirect("TEACHER");

  // Get the teacher info
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      teacher: true, // Fetch teacher data
    },
  });

  // Check if the user has a teacher account
  if (!userData?.teacher) {
    return unauthorized("Access restricted: Teacher account required");
  }

  // Get the teacher's ID
  const teacherId = userData.teacher.id;

  // Fetch the courses taught by the teacher
  const courses = await prisma.course.findMany({
    where: {
      teacherId: teacherId, // Filter courses by the teacherId
    },
    include: {
      grade: true, // Include grade details for each course
    },
  });

  // Get all unique grades associated with the teacher's courses
  const gradeIds = courses.map(course => course.grade.id);

  // Fetch students in the grades that the teacher teaches
  const students = await prisma.student.findMany({
    where: {
      gradeId: { in: gradeIds }, // Filter students by the gradeIds
    },
    include: {
      grade: true, // Include grade details for each student
    },
  });

  // Format the student data
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
