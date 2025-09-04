import { connectToDB } from "@/lib/db/db";
import Inquire from "@/models/inquire.model";
import { NextResponse } from "next/server";

// ✅ GET all inquiries
export async function GET() {
  try {
    await connectToDB();
    const inquires = await Inquire.find().sort({ createdAt: -1 });
    return NextResponse.json(inquires, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST (create new inquiry)
export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const { name, email, phone } = body;
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const inquire = new Inquire({ name, email, phone });
    await inquire.save();

    return NextResponse.json(inquire, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
