import { NextResponse } from "next/server";
import Review from "@/models/review.model";
import Course from "@/models/course.model";
import { connectToDB } from "@/lib/db/db";

// ✅ GET all reviews
export async function GET() {
  try {
    await connectToDB();
    const reviews = await Review.find().populate("course");
    return NextResponse.json(reviews, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}




// // ✅ POST (create new review)
// export async function POST(req: Request) {
//   try {
//     await connectToDB();
//     const body = await req.json();

//     const { course, ...reviewData } = body;

//     // create review
//     const newReview = new Review({ ...reviewData, course });
//     await newReview.save();

//     // update course references
//     await Course.findByIdAndUpdate(course, {
//       $push: { reviews: newReview._id },
//       $inc: { reviewsCount: 1 },
//     });

//     return NextResponse.json(newReview, { status: 201 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }









import mongoose from "mongoose";

// ✅ POST (create new review)
export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const { course, ...reviewData } = body;

    // ✅ cast string → ObjectId
    const courseId = new mongoose.Types.ObjectId(course);

    // create review
    const newReview = new Review({ ...reviewData, course: courseId });
    await newReview.save();

    // update course references
    await Course.findByIdAndUpdate(courseId, {
      $push: { reviews: newReview._id },
      $inc: { reviewsCount: 1 },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error posting review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
