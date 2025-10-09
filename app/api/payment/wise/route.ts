import { connectToDB } from "@/lib/db/db";
import wisepaymentModel from "@/models/wisepayment.model";
import { NextResponse } from "next/server";

// ✅ Create new Wise Payment (Student uploads screenshot)
export async function POST(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();

    const { inquiry, amount, screenshotUrl, cloudinaryPublicId } = body;

    if (!inquiry || !amount || !screenshotUrl || !cloudinaryPublicId) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const newPayment = await wisepaymentModel.create({
      inquiry,
      amount,
      screenshotUrl,
      cloudinaryPublicId,
    });

    return NextResponse.json(
      { success: true, payment: newPayment },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating Wise payment:", error);
    return NextResponse.json(
      { error: "Failed to create Wise payment" },
      { status: 500 }
    );
  }
}


export async function GET(request: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const inquiryId = searchParams.get("inquiryId");

    console.log("🔍 Received inquiryId:", inquiryId);

    // ✅ CASE 1: Specific inquiry payments
    if (inquiryId) {
      const latestPayment = await wisepaymentModel
        .findOne({ inquiry: inquiryId })
        .sort({ createdAt: -1 })
        .select("status screenshotUrl approvedAt amount createdAt");

      console.log("latestPayment:", latestPayment);

      if (!latestPayment) {
        return NextResponse.json({ message: "No Wise payment found" }, { status: 404 });
      }

      return NextResponse.json({
        wiseStatus: latestPayment.status,
        wiseScreenshot: latestPayment.screenshotUrl,
        amount: latestPayment.amount,
        approvedAt: latestPayment.approvedAt,
        createdAt: latestPayment.createdAt,
      });
    }

    // ✅ CASE 2: If no inquiryId → return all payments
    console.log("📋 Fetching all WisePayments");
    const payments = await wisepaymentModel
      .find()
      .populate("inquiry", "name email phone")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, payments });
  } catch (error) {
    console.error("❌ Error fetching Wise Payment(s):", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}


