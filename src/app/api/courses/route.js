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

    await prisma.course.create({
      data: {
        ...body,
      }
    })

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
    
  }  catch (error) {
    console.error("[COURSES_POST]", error);
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}