

import { NextResponse } from "next/server";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false, // important for webhook verification
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  try {
    // 1️⃣ Raw body
    const buf = await req.arrayBuffer();
    const rawBody = Buffer.from(buf);

    // 2️⃣ Stripe signature
    const signature = req.headers.get("stripe-signature")!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // 3️⃣ Handle payment success
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const parentInquiry = session.metadata?.parentInquiry;
      if (!parentInquiry) throw new Error("parentInquiry missing in metadata");

      // ✅ Import models + connect DB
      const { default: Student } = await import("@/models/student.model");
      const { default: Inquiry } = await import("@/models/inquire.model");
      await import("@/lib/db/db").then((m) => m.connectToDB());

      // 4️⃣ Update all active students of this inquiry
      const students = await Student.find({
        parentInquiry,
        status: { $ne: "quit" },
      });

      const updatedStudents = [];
      for (const s of students) {
        s.feeStatus.paid = true;
        s.feeStatus.lastPaymentDate = new Date();

        if (s.status === "trial") {
          s.status = "ongoing";
        }

        await s.save();
        updatedStudents.push({
          id: s._id.toString(),
          name: s.name,
          status: s.status,
          feeStatus: s.feeStatus,
        });
      }

      // 5️⃣ Reset paymentLink in inquiry
      const updatedInquiry = await Inquiry.findByIdAndUpdate(
        parentInquiry,
        {
          $set: {
            paymentLink: null,
            "paymentStatus.paid": true,
            "paymentStatus.lastPaymentDate": new Date(),
          },
        },
        { new: true }
      );

      // 🔍 Logs
      console.log("✅ Students updated after payment:", updatedStudents);
      console.log("✅ Inquiry updated after payment:", {
        id: updatedInquiry?._id.toString(),
        paymentStatus: updatedInquiry?.paymentStatus,
      });

      console.log(
        `✅ Inquiry ${parentInquiry} marked paid. ${students.length} students updated.`
      );
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
