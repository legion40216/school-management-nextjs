import React from 'react'
import Client from './_components/client';

export default async function page() {

  const grades = await prisma.grade.findMany({
    orderBy: {
      title: 'asc',
    },
    include: {
      courses: true,
    },
  });

 return (
    <div>
        <Client 
        grades = {grades}
        />
    </div>

  )
}

