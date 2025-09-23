

import { stripe } from "@/lib/utils/stripe";
import { NextResponse } from "next/server";
import Student from "@/models/student.model";
import { connectToDB } from "@/lib/db/db";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { studentId, fee, name, email } = await req.json();

    if (!studentId || !fee || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1️⃣ Check if student already has a payment link
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // If payment link already exists and feeStatus.paid is false, return existing link
    if (student.paymentLink && !student.feeStatus.paid) {
      return NextResponse.json({ url: student.paymentLink }, { status: 200 });
    }

    // Stripe expects amounts in cents
    const amount = Math.round(fee * 100);

    // 2️⃣ Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Fee Payment - ${name}` },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.APP_URL}/student-dashboard/payments`,
      cancel_url: `${process.env.APP_URL}/student-dashboard/payments`,
      metadata: {
        studentId, 
      },
    });

    // 3️⃣ Save payment link to student
    student.paymentLink = session.url;
    await student.save();

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
