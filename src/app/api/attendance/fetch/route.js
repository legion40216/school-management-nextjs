import { auth } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { getDateRange } from "@/utils/getDateRange";
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

    const { gradeId, courseId, date } = body;

    // Date validation
    const { startOfDay, endOfDay } = getDateRange(date);
  
    const attendanceData = await prisma.attendance.findMany({
      where: {
        ...(gradeId && { student: { gradeId } }), // Filter by gradeId through student relation
        ...(courseId && { courseId }),
        ...(startOfDay && endOfDay && {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        }),
      },
      include: { 
        student: {
          include: {
            grade: true // Include grade information
          }
        }, 
        course: true 
      },
      orderBy: {
        student: {
          rollNo: 'asc' // Optional: order by roll number
        }
      }
    });

    return NextResponse.json(
      { success: true, data: attendanceData },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("[ATTENDANCE_FETCH_POST]", error);
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}