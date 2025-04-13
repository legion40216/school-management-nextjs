import { NextResponse } from 'next/server';
import prisma from "@/lib/prismadb";
import { auth } from '@/lib/auth';

export async function DELETE(request, { params }) {
  try {
    // Authenticate user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // Extract and validate courseId
    const { courseId } = await params;

    if (!courseId || typeof courseId !== 'string') {
      return NextResponse.json(
        { error: "Invalid or missing courseID" },
        { status: 400 }
      );
    }

    await prisma.course.delete({
      where: { id: courseId }
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("[COURSE_DELETE]", error);
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}