


import { NextResponse } from "next/server";
import Instructor from "@/models/instructor.model";
import { connectToDB } from "@/lib/db/db";


import { v2 as cloudinary } from "cloudinary";
import courseModel from "@/models/course.model";

// ✅ GET by ID
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params; 
    const instructor = await Instructor.findById(id);

    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(instructor, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// ✅ PUT (update by ID)
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;
    const body = await req.json();

    // 1️⃣ Get previous instructor
    const prevInstructor = await Instructor.findById(id);
    if (!prevInstructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Check if image changed
    if (body.image && body.image !== prevInstructor.image) {
      if (
        prevInstructor.image?.startsWith("https://res.cloudinary.com") &&
        prevInstructor.cloudinaryImageId
      ) {
        try {
          await cloudinary.uploader.destroy(prevInstructor.cloudinaryImageId);
          console.log("✅ Old Cloudinary image deleted");
        } catch (err) {
          console.error("❌ Failed to delete old image from Cloudinary:", err);
        }
      }
    }

    // 3️⃣ Update instructor
    const updatedInstructor = await Instructor.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedInstructor, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}





// Configure cloudinary (only on server side, safe to use API secret here)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;

    // 🔎 Find instructor first
    const instructor = await Instructor.findById(id);
    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found" },
        { status: 404 }
      );
    }

    // 1️⃣ Nullify instructor reference in courses
    await courseModel.updateMany(
      { instructor: id },
      { $set: { instructor: null } }
    );

    // 2️⃣ Delete Cloudinary image if valid
    if (
      instructor.image &&
      instructor.image.startsWith("https://res.cloudinary.com") &&
      instructor.cloudinaryImageId
    ) {
      try {
        await cloudinary.uploader.destroy(instructor.cloudinaryImageId);
        console.log("🗑️ Cloudinary image deleted:", instructor.cloudinaryImageId);
      } catch (err) {
        console.error("⚠️ Cloudinary deletion failed:", err);
      }
    } else {
      console.log("ℹ️ Skipped Cloudinary deletion (placeholder image).");
    }

    // 3️⃣ Delete instructor
    await Instructor.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Instructor deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("🔥 Delete Instructor Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
