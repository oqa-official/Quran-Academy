import { NextResponse } from "next/server";
import Instructor from "@/models/instructor.model";
import { connectToDB } from "@/lib/db/db";
import { generateInstructorEducationMail, generateInstructorPassword, generateInstructorUserId } from "@/lib/utils/instructorHelpers";

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
    if (!name || !number  || !email) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // ✅ Auto fields
    const userId = await generateInstructorUserId();
    const educationMail = await generateInstructorEducationMail();
    const password = incomingPassword || generateInstructorPassword(name);

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

    await newInstructor.save();

    return NextResponse.json(newInstructor, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error in POST /api/db/instructors:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
