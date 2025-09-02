// import { NextResponse } from "next/server";
// import Course from "@/models/course.model";
// import { connectToDB } from "@/lib/db/db";


// import Review from "@/models/review.model";
// import { v2 as cloudinary } from "cloudinary";

// // ✅ GET by ID
// export async function GET(
//     _: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectToDB();
//         const { id } = await context.params; 
//     const course = await Course.findById(id)
//       .populate("instructor")
//       .populate("reviews");

//     if (!course) {
//       return NextResponse.json({ error: "Course not found" }, { status: 404 });
//     }

//     return NextResponse.json(course, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }





// export async function PUT(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectToDB();
//     const { id } = await context.params;
//     const body = await req.json();

//     const existingCourse = await Course.findById(id);
//     if (!existingCourse) {
//       return NextResponse.json({ error: "Course not found" }, { status: 404 });
//     }

//     // ✅ If image has changed → remove old Cloudinary image
//     if (
//       body.image &&
//       body.image !== existingCourse.image && // new image provided
//       existingCourse.image?.startsWith("https://res.cloudinary.com") &&
//       existingCourse.cloudinaryImageId
//     ) {
//       await cloudinary.uploader.destroy(existingCourse.cloudinaryImageId);
//     }

//     // ✅ Update course
//     const updatedCourse = await Course.findByIdAndUpdate(id, body, {
//       new: true,
//       runValidators: true,
//     });

//     return NextResponse.json(updatedCourse, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }











// export async function DELETE(
//   _: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectToDB();
//     const { id } = await context.params;

//     const course = await Course.findById(id);
//     if (!course) {
//       return NextResponse.json({ error: "Course not found" }, { status: 404 });
//     }

//     // ✅ If image is on Cloudinary → delete it
//     if (course.image?.startsWith("https://res.cloudinary.com") && course.cloudinaryImageId) {
//       await cloudinary.uploader.destroy(course.cloudinaryImageId);
//     }

//     // ✅ Delete all reviews tied to this course
//     await Review.deleteMany({ course: course._id });

//     // ✅ Delete the course itself
//     await Course.findByIdAndDelete(id);

//     return NextResponse.json({ message: "Course, reviews & image deleted" }, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
















import { NextResponse } from "next/server";
import Course from "@/models/course.model";
import Review from "@/models/review.model";
import { connectToDB } from "@/lib/db/db";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (server-side only)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

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
    console.error("🔥 GET Course Error:", error);
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

    // 1️⃣ Get existing course
    const prevCourse = await Course.findById(id);
    if (!prevCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 2️⃣ Check if image changed
    if (body.image && body.image !== prevCourse.image) {
      if (
        prevCourse.image?.startsWith("https://res.cloudinary.com") &&
        prevCourse.cloudinaryImageId
      ) {
        try {
          await cloudinary.uploader.destroy(prevCourse.cloudinaryImageId);
          console.log("✅ Old Cloudinary course image deleted");
        } catch (err) {
          console.error("❌ Failed to delete old course image:", err);
        }
      }
    }

    // 3️⃣ Update course
    const updatedCourse = await Course.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error: any) {
    console.error("🔥 PUT Course Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE (course + reviews + image)
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;

    // 1️⃣ Find course first
    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 2️⃣ Delete Cloudinary image if valid
    if (
      course.image &&
      course.image.startsWith("https://res.cloudinary.com") &&
      course.cloudinaryImageId
    ) {
      try {
        await cloudinary.uploader.destroy(course.cloudinaryImageId);
        console.log("🗑️ Cloudinary course image deleted:", course.cloudinaryImageId);
      } catch (err) {
        console.error("⚠️ Cloudinary deletion failed:", err);
      }
    } else {
      console.log("ℹ️ Skipped Cloudinary deletion (placeholder image).");
    }

    // 3️⃣ Delete all reviews tied to this course
    await Review.deleteMany({ course: course._id });

    // 4️⃣ Delete course
    await Course.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Course, reviews & image deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("🔥 DELETE Course Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
