import { auth } from "@/lib/auth"
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
     // Authenticate user
     const session = await auth();
 
     if (!session?.user?.id) {
       return NextResponse.json(
         { error: "Unauthorized" }, 
         { status: 401 }
       );
     }
 
    const body = await req.json()

    await prisma.student.create({
      data: {
        name: body.name,
        fatherName: body.fatherName,
        rollNo: body.rollNo,
        gradeId: body.gradeId,
        studentImages: {
          create: body.images.map((img) => ({ url: img.url })),
        },
      },
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
    
  }  catch (error) {
    console.error("[STUDENT_POST]", error);
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}