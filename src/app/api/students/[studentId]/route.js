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

    // Extract and validate studentId
    const { studentId } = await params;

    if (!studentId || typeof studentId !== 'string') {
      return NextResponse.json(
        { error: "Invalid or missing studentID" },
        { status: 400 }
      );
    }

    await prisma.student.delete({
      where: { id: studentId }
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("[STUDENT_DELETE]", error);
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}