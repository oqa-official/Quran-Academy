

import { stripe } from "@/lib/utils/stripe";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import Student from "@/models/student.model";
import inquireModel from "@/models/inquire.model";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { parentInquiry } = await req.json();
    console.log("recieved parent inquiry", parentInquiry)

    if (!parentInquiry) {
      return NextResponse.json({ error: "Missing parentId" }, { status: 400 });
    }

    // 1️⃣ Find the inquiry
    const inquiry = await inquireModel.findById(parentInquiry);
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // 2️⃣ Fetch active students under this inquiry
    const students = await Student.find({
      parentInquiry: parentInquiry,
      status: { $ne: "quit" },
    });

    if (!students || students.length === 0) {
      return NextResponse.json(
        { error: "No active students found" },
        { status: 400 }
      );
    }

    // 3️⃣ Calculate total fee
    const totalFee = students.reduce((sum, s) => sum + (s.price || 0), 0);

    // 4️⃣ Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: inquiry.email, // assume parent inquiry has email field
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Fee Payment for ${students.length} student(s)`,
            },
            unit_amount: totalFee * 100, // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.APP_URL}/student-dashboard/payments`,
      cancel_url: `${process.env.APP_URL}/student-dashboard/payments`,
      metadata: {
        parentInquiry: inquiry._id.toString(),
        studentIds: students.map((s) => s._id.toString()).join(","),
      },
    });

    // 5️⃣ Save link to inquiry
    inquiry.paymentLink = session.url;
    await inquiry.save();

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error creating payment link:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
