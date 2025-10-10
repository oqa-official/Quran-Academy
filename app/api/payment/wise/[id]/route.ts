import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import { v2 as cloudinary } from "cloudinary";
import wisepaymentModel from "@/models/wisepayment.model";
import inquireModel from "@/models/inquire.model";

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

    const { status } = await req.json();
    // 1️⃣ Fetch payment record first
    const payment = await wisepaymentModel.findById(id).populate("inquiry");
    if (!payment) {
      console.error("❌ No Wise payment found for ID:", id);
      return NextResponse.json({ error: "Wise payment not found" }, { status: 404 });
    }

    // 2️⃣ If rejected → just update status
    if (status === "rejected") {
      payment.status = "rejected";
      await payment.save();
      return NextResponse.json({ message: "Payment rejected" }, { status: 200 });
    }

    // 3️⃣ If approved → handle inquiry update first
    if (status === "approved") {
      const parentInquiryId = payment.inquiry?._id;

      if (!parentInquiryId) {
        return NextResponse.json({ error: "No linked inquiry found" }, { status: 400 });
      }


      // Prepare dates
      const now = new Date();
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + 28);

      const extendedDueDate = new Date(now);
      extendedDueDate.setMonth(extendedDueDate.getMonth() + 1);
      extendedDueDate.setDate(extendedDueDate.getDate() + 1);

      // 4️⃣ Update Inquiry first
      const updatedInquiry = await inquireModel.findByIdAndUpdate(
        parentInquiryId,
        {
          $set: {
            paymentLink: null,
            "paymentStatus.paid": true,
            "paymentStatus.lastPaymentDate": now,
            dueDate,
            extendedDueDate,
          },
        },
        { new: true }
      );

      if (!updatedInquiry) {
        return NextResponse.json(
          { error: "Failed to update parent inquiry. Payment not approved." },
          { status: 500 }
        );
      }


      // 5️⃣ Now safely update payment status
      payment.status = "approved";
      payment.approvedAt = now;
      await payment.save();
      return NextResponse.json({ message: "Payment approved successfully" }, { status: 200 });
    }

    // 6️⃣ Invalid status handling
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
  } catch (error: any) {
    console.error("❌ Error in PUT /api/payment/wise/[id]:", error);
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
