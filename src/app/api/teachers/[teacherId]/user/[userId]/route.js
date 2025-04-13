import { NextResponse } from 'next/server';
import prisma from "@/lib/prismadb";
import { auth } from '@/lib/auth';

export async function DELETE(request,{params}) {

  try {
  // Authenticate user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const { userId } = await params;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: "Invalid or missing userID" },
        { status: 400 }
      );
    }
 
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

   } catch (error) {
    console.error("[TEACHER_USER_DELETE]", error);
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
