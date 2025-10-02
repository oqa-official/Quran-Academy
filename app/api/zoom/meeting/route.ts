// app/api/zoom/meeting/route.ts
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;
const ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID!;

async function getAccessToken() {
  const response = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ACCOUNT_ID}`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch access token from Zoom");
  }

  return response.json();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Get access token
    const { access_token } = await getAccessToken();

    // 2. Create meeting
    const zoomResponse = await fetch(
      `https://api.zoom.us/v2/users/me/meetings`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: body.topic || "Test Meeting",
          type: 2, // Scheduled meeting
          start_time: body.start_time || "2025-09-28T10:00:00Z",
          duration: body.duration || 30,
          settings: {
            join_before_host: true,
          },
        }),
      }
    );

    const data = await zoomResponse.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
