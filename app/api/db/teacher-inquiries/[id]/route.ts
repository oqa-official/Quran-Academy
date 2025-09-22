import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import { v2 as cloudinary } from "cloudinary";
import teacherInquiryModel from "@/models/teacher-inquiry.model";

// ✅ Configure cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

// 🟢 GET single Teacher Inquiry by ID
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;

    const inquiry = await teacherInquiryModel.findById(id);
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json(inquiry, { status: 200 });
  } catch (error: any) {
    console.error("GET /teacher-inquiries/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟢 PUT (Update Teacher Inquiry by ID)
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;
    const body = await req.json();

    const prevInquiry = await teacherInquiryModel.findById(id);
    if (!prevInquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Cleanup for files if replaced
    const fileFields = [
      { url: "cnicFrontUrl", id: "cnicFrontCloudinaryId" },
      { url: "cnicBackUrl", id: "cnicBackCloudinaryId" },
      { url: "qualificationUrl", id: "qualificationCloudinaryId" },
      { url: "experienceUrl", id: "experienceCloudinaryId" },
    ];

    for (const { url, id: cloudId } of fileFields) {
      if (body[url] && body[url] !== prevInquiry[url]) {
        if (
          prevInquiry[url]?.startsWith("https://res.cloudinary.com") &&
          prevInquiry[cloudId]
        ) {
          try {
            await cloudinary.uploader.destroy(prevInquiry[cloudId], {
              resource_type: "auto",
            });
            console.log(`🗑️ Old file deleted from Cloudinary: ${cloudId}`);
          } catch (err) {
            console.error(`⚠️ Failed to delete ${cloudId}:`, err);
          }
        }
      }
    }

    // Update document
    const updatedInquiry = await teacherInquiryModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedInquiry, { status: 200 });
  } catch (error: any) {
    console.error("PUT /teacher-inquiries/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}










// 🟢 DELETE Teacher Inquiry by ID (with Cloudinary cleanup)
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;

    const inquiry = await teacherInquiryModel.findById(id);
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Only image fields
    const fileFields = [
      { url: "cnicFrontUrl", id: "cnicFrontCloudinaryId" },
      { url: "cnicBackUrl", id: "cnicBackCloudinaryId" },
      { url: "qualificationUrl", id: "qualificationCloudinaryId" },
      { url: "experienceUrl", id: "experienceCloudinaryId" },
    ];

    for (const { id: cloudId } of fileFields) {
      const publicId = inquiry[cloudId];

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
          console.log(`🗑️ Deleted from Cloudinary: ${publicId} (image)`);
        } catch (err) {
          console.error(`⚠️ Failed to delete ${cloudId}:`, err);
        }
      }
    }

    // Delete DB record
    await teacherInquiryModel.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Teacher Inquiry deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /teacher-inquiries/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
