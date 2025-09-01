import { NextResponse } from "next/server";
import Review from "@/models/review.model";
import Course from "@/models/course.model";
import { connectToDB } from "@/lib/db/db";

// ✅ GET by ID
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
        const { id } = await context.params; 
    await connectToDB();
    const review = await Review.findById(id).populate("course");

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT (update review)
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
     const { id } = await context.params; 
    const body = await req.json();

    const updatedReview = await Review.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE
export async function DELETE(  _: Request,
  context: { params: Promise<{ id: string }> }) {
  try {
    await connectToDB();
    const { id } = await context.params; // 👈 unwrap

    // find review to get courseId
    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // remove review from DB
    await Review.findByIdAndDelete(id);

    // also update course reviews array + count
    await Course.findByIdAndUpdate(review.course, {
      $pull: { reviews: review._id },
      $inc: { reviewsCount: -1 },
    });

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
