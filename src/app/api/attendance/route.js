import { auth } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Authenticate user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { gradeId, courseId, date, data } = body;

    // Validate required fields
    if (!gradeId || !courseId || !date || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

// 3. Submit attendance records
 await prisma.$transaction(
  data.map(item => 
    prisma.attendance.upsert({
      where: {
        date_studentId_courseId: {
          date: new Date(date),
          studentId: item.student.id,
          courseId: courseId,
        },
      },
      create: {
        date: new Date(date),
        status: item.status,
        studentId: item.student.id,
        courseId: courseId,
        notes: item.notes || null,
      },
      update: {
        status: item.status,
        notes: item.notes || null,
      },
    })
  )
);

    // 4. Fetch the complete attendance data with relations
    const attendanceData = await prisma.attendance.findMany({
      where: {
        date: new Date(date),
        courseId: courseId,
        studentId: { in: data.map(item => item.student.id) }
      },
      include: {
        student: {
          include: {
            grade: true,
          },
        },
        course: true,
      },
      orderBy: {
        student: {
          rollNo: 'asc', // Optional: order by roll number
        },
      },
    });

    return NextResponse.json(
      { 
        success: true,
        message: "Attendance submitted successfully",
        data:    attendanceData
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("[ATTENDANCE_SUBMIT]", error);
    
    return NextResponse.json(
      { 
        error: "An unexpected error occurred",
        details: error.message 
      },
      { status: 500 }
    );
  }
}