import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // ❌ Clear the session cookie
  cookieStore.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // expires immediately
  });

  return NextResponse.json({ message: "Logged out" }, { status: 200 });
}
