import { NextResponse } from "next/server";
import Course from "@/models/course.model";
import { connectToDB } from "@/lib/db/db";

// ✅ GET by ID
export async function GET(
    _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
        const { id } = await context.params; 
    const course = await Course.findById(id)
      .populate("instructor")
      .populate("reviews");

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT (update course)
export async function PUT(  req: Request,
  context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDB();
     const { id } = await context.params; 
    const body = await req.json();

    const updatedCourse = await Course.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}










// in app/api/courses/[id]/route.ts → DELETE
import Review from "@/models/review.model";

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
        const { id } = await context.params; // 👈 unwrap

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // ✅ Delete all reviews tied to this course
    await Review.deleteMany({ course: course._id });

    // ✅ Delete the course itself
    await Course.findByIdAndDelete(id);

    return NextResponse.json({ message: "Course and its reviews deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
