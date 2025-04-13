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

    // Extract and validate teacherId
    const { teacherId } = await params;

    if (!teacherId || typeof teacherId !== 'string') {
      return NextResponse.json(
        { error: "Invalid or missing teacherID" },
        { status: 400 }
      );
    }

    await prisma.teacher.delete({
      where: { id: teacherId }
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("[TEACHER_DELETE]", error);
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}