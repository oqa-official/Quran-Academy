import { connectToDB } from "@/lib/db/db";
import meetingModel from "@/models/meeting.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    const meeting = await meetingModel.find()
    return NextResponse.json(meeting, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}







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

    // 2. Create meeting on Zoom
    const zoomResponse = await fetch(
      `https://api.zoom.us/v2/users/me/meetings`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: body.topic || "Quran Class",
          type: 2, // Scheduled meeting
          start_time: body.startTime || new Date().toISOString(),
          duration: body.duration || 45,
          settings: {
            join_before_host: true,
          },
        }),
      }
    );

    if (!zoomResponse.ok) {
      const errorData = await zoomResponse.json();
      throw new Error(errorData.message || "Zoom API Error");
    }

    const zoomData = await zoomResponse.json();

    // 3. Store in DB
    await connectToDB();

    const newMeeting = await meetingModel.create({
      topic: zoomData.topic,
      zoomId: zoomData.id,
      joinUrl: zoomData.join_url,
      startTime: zoomData.start_time,
      duration: zoomData.duration,
      password: zoomData.password,
      createdBy: body.createdBy || "admin", // optional field if you want
    });

    // 4. Return stored meeting
    return NextResponse.json(newMeeting, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
