import { NextResponse } from "next/server";
import Course from "@/models/course.model";
import { connectToDB } from "@/lib/db/db";

// ✅ GET all courses
export async function GET() {
  try {
    await connectToDB();
    const courses = await Course.find()
      .populate("instructor") // include instructor details
      // .populate("reviews");   // include reviews

    return NextResponse.json(courses, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST (create a new course)
export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const newCourse = new Course(body);
    await newCourse.save();

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
