import { connectToDB } from "@/lib/db/db";
import Admin from "@/models/admin.model";
import { NextResponse } from "next/server";

// ✅ GET all admins
export async function GET() {
  try {
    await connectToDB();
    const admins = await Admin.find({});
    return NextResponse.json(admins, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST new admin (if you want to seed manually, skip in prod)
export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const newAdmin = new Admin(body);
    await newAdmin.save();

    return NextResponse.json(newAdmin, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
