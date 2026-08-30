import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { studentSchema } from "@/lib/studentSchema";

export async function GET() {
  try {
    const students = await prisma.student.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "ดึงข้อมูลล้มเหลว" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = studentSchema.parse(body);
    const newStudent = await prisma.student.create({
      data: validatedData,
    });
    return NextResponse.json({ message: "Success", data: newStudent });

    } 
    catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: (error as any).errors[0].message }, 
        { status: 400 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "รหัสนักศึกษานี้มีในระบบแล้ว" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }, { status: 500 });
  }
}