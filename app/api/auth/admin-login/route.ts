

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDB } from "@/lib/db/db";
import Admin from "@/models/admin.model";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const body = await req.json();
    const { educationMail, password } = body;

    if (!educationMail || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    // --- Admin ---
    let user = await Admin.findOne({ educationMail });
    if (user && user.password === password) {
      cookieStore.set("session", JSON.stringify({ userId: user._id, role: "admin" }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 4, // 4 days
      });

      return NextResponse.json(
        { _id: user._id, role: "admin", redirect: "/admin-dashboard" },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
