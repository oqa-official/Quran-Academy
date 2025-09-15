import { NextResponse } from "next/server";
import Instructor from "@/models/instructor.model";
import { connectToDB } from "@/lib/db/db";
import { generateInstructorEducationMail, generateInstructorPassword, generateInstructorUserId } from "@/lib/utils/instructorHelpers";
import mongoose from "mongoose";

// ✅ GET all instructors
export async function GET() {
  try {
    await connectToDB();
    const instructors = await Instructor.find();
    return NextResponse.json(instructors, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function POST(req: Request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectToDB();
    const body = await req.json();

    const {
      name,
      number,
      emergencyNumber,
      email,
      image,
      cloudinaryImageId,
      designation,
      about,
      qualifications,
      password: incomingPassword,
    } = body;

    // ✅ Required validations
    if (!name || !number || !email) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // ✅ Auto fields (with counters inside transaction)
    const userId = await generateInstructorUserId(session);
    const educationMail = await generateInstructorEducationMail(userId);
    const password = incomingPassword || generateInstructorPassword(name);

     const existing = await Instructor.findOne({email});
      if (existing) {
      return NextResponse.json(
        { error: "Email already exists Try again with different one" },
        { status: 400 }
      );
    }

    const newInstructor = new Instructor({
      name,
      number,
      emergencyNumber,
      email,
      image,
      cloudinaryImageId,
      designation,
      about,
      qualifications,
      userId,
      educationMail,
      password,
    });

    await newInstructor.save({ session });

    // Commit only if everything succeeded
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(newInstructor, { status: 201 });
  } catch (error: any) {
    // Rollback if failed
    await session.abortTransaction();
    session.endSession();

    console.error("❌ Error in POST /api/db/instructors:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 