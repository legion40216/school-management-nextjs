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

    // Extract and validate gradeId
    const { gradeId } = await params;

    if (!gradeId || typeof gradeId !== 'string') {
      return NextResponse.json(
        { error: "Invalid or missing gradeID" },
        { status: 400 }
      );
    }

    await prisma.grade.delete({
      where: { id: gradeId }
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error("[GRADE_DELETE]", error);
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}