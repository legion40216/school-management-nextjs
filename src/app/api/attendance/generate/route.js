import { getDateRange } from "@/utils/getDateRange";
import { auth } from "@/lib/auth"
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
     
    // Date validation
    const { startOfDay, endOfDay } = getDateRange(body.date);

    const existingAttendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        courseId: body.courseId,
        student: {
          gradeId: body.gradeId,
        },
      },
    });

    if (existingAttendance.length > 0) {
      return NextResponse.json(
        { error: "Attendance for this date already exists." },
        { status: 409 }
      );
    }

    const students = await prisma.student.findMany({
      where: { gradeId: body.gradeId },
      include: { grade: true },
    });

    const course = await prisma.course.findUnique({
      where: { id: body.courseId },
    });

    const attendanceRecords = students.map(student => ({
      studentId: student.id,
      gradeId: body.gradeId,
      courseId: body.courseId,
      date: new Date(body.date),
      status: 'PRESENT',
      student: {
        id: student.id,
        name: student.name,
        rollNo: student.rollNo,
        grade: student.grade,
      },
      course: course,
    }));

    return NextResponse.json(
      { success: true, data: attendanceRecords },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("[ATTENDANCE_GENERATE_POST]", error);
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}