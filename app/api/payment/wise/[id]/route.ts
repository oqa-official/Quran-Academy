import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import { v2 as cloudinary } from "cloudinary";
import wisepaymentModel from "@/models/wisepayment.model";

// ✅ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

// ✅ GET WisePayment by ID
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;

    const payment = await wisepaymentModel.findById(id)
      .populate("inquiry", "name email phone") // optional: populate related inquiry

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json(payment, { status: 200 });
  } catch (error: any) {
    console.error("🔥 GET WisePayment Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function PUT(
   req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectToDB();
    const body = await req.json();

    const updatedAdmin = await wisepaymentModel.findByIdAndUpdate(id, body, {});

    if (!updatedAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAdmin, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



// ✅ DELETE WisePayment by ID (with Cloudinary cleanup)
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;

    const payment = await wisepaymentModel.findById(id);
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // 1️⃣ Delete Cloudinary Screenshot
    if (
      payment.screenshotUrl &&
      payment.screenshotUrl.startsWith("https://res.cloudinary.com") &&
      payment.cloudinaryPublicId
    ) {
      try {
        await cloudinary.uploader.destroy(payment.cloudinaryPublicId);
        console.log("🗑️ Cloudinary screenshot deleted:", payment.cloudinaryPublicId);
      } catch (err) {
        console.error("⚠️ Failed to delete screenshot from Cloudinary:", err);
      }
    }

    // 2️⃣ Delete the document from DB
    await wisepaymentModel.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Wise payment deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("🔥 DELETE WisePayment Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
