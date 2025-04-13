import React from 'react'
import Client from './_components/client';
import { currentUser } from '@/hooks/server-auth-utils';
import { checkRoleAndRedirect } from '@/hooks/use-redirect-role';
import { unauthorized } from 'next/navigation';

export default async function page() {
  const user = await currentUser();
  
  // Check if the user is authenticated 
  if (!user) {
    return unauthorized("Access restricted: Teacher account required");
  }

  // Check if the user has an teacher role
  await checkRoleAndRedirect("TEACHER");

  // Get the teacher info
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      teacher: true,
    },
  });

  // Check if the user has a teacher account
  if (!userData?.teacher) {
    return unauthorized("Access restricted: Teacher account required");
  }

  // Fetch only the grades where the teacher has courses
  const teacherGrades = await prisma.grade.findMany({
    where: {
      courses: {
        some: {
          teacherId: userData.teacher.id
        }
      }
    },
    orderBy: {
      title: 'asc',
    },
    include: {
      courses: {
        where: {
          teacherId: userData.teacher.id
        }
      }
    },
  });

  return (
    <div>
      <Client 
        grades={teacherGrades}
      />
    </div>
  );
}

