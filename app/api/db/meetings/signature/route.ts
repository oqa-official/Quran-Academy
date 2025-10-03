import { NextResponse } from "next/server";
import crypto from "crypto";

const ZOOM_API_KEY = process.env.ZOOM_CLIENT_ID!;
const ZOOM_API_SECRET = process.env.ZOOM_CLIENT_SECRET!;

export async function POST(req: Request) {
  try {
    const { meetingNumber, role } = await req.json(); 
    // role: 0 = participant, 1 = host

    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2; // valid for 2 hours

    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      sdkKey: ZOOM_API_KEY,
      mn: meetingNumber,
      role,
      iat,
      exp,
      appKey: ZOOM_API_KEY,
      tokenExp: exp,
    };

    const base64Url = (str: string) =>
      Buffer.from(str).toString("base64url");

    const headerEncoded = base64Url(JSON.stringify(header));
    const payloadEncoded = base64Url(JSON.stringify(payload));

    const signature = crypto
      .createHmac("sha256", ZOOM_API_SECRET)
      .update(`${headerEncoded}.${payloadEncoded}`)
      .digest("base64url");

    const jwt = `${headerEncoded}.${payloadEncoded}.${signature}`;

    return NextResponse.json({ signature: jwt });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
