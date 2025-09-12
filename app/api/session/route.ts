import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    return NextResponse.json({ userId: null, role: null }, { status: 200 });
  }

  try {
    const parsed = JSON.parse(session.value);
    return NextResponse.json(parsed, { status: 200 });
  } catch {
    return NextResponse.json({ userId: null, role: null }, { status: 200 });
  }
}
