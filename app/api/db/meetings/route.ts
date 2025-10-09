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


const WHEREBY_API_KEY = process.env.WHEREBY_API_KEY!;
const WHEREBY_API_URL = "https://api.whereby.dev/v1/meetings";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await connectToDB();

    // 1. Create a new meeting using Whereby API
    const wherebyRes = await fetch(WHEREBY_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHEREBY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1-hour meeting
        roomMode: "group",
        fields: ["hostRoomUrl", "meetingId", "roomUrl"],
      }),
    });

    if (!wherebyRes.ok) {
      const text = await wherebyRes.text();
      throw new Error(`Whereby API error: ${text}`);
    }

    const wherebyData = await wherebyRes.json();

    // 2. Save meeting to MongoDB
    const newMeeting = await meetingModel.create({
      zoomId: wherebyData.meetingId, // reusing zoomId field
      topic: body.topic || "Quran Class",
      startTime: new Date(),
      duration: 60,
      joinUrl: wherebyData.roomUrl,
      startUrl: wherebyData.hostRoomUrl,
      createdBy: body.createdBy || "admin",
    });

    // 3. Return the stored meeting
    return NextResponse.json(newMeeting, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create Whereby meeting" },
      { status: 500 }
    );
  }
}
