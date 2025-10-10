import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import CommunicationLog from "@/models/communicationLogModel";

// ------------------ POST → Add new log ------------------
export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const { receiverName, receiverEmail, receiverNumber, receiverType, channel, messageType } = body;

    // Basic validation
    if (!receiverType || !channel || !messageType) {
      return NextResponse.json(
        { error: "receiverType, channel, and messageType are required." },
        { status: 400 }
      );
    }

    const log = await CommunicationLog.create({
      receiverName,
      receiverEmail,
      receiverNumber,
      receiverType,
      channel,
      messageType,
    });

    console.log("[CommunicationLog] ✅ New log created:", log);

    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch (error: any) {
    console.error("[CommunicationLog] ❌ Error creating log:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function GET(req: Request) {
  try {
    await connectToDB();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const channel = searchParams.get("channel"); // email | whatsapp
    const receiverType = searchParams.get("receiverType"); // student | parent | teacher
    const messageType = searchParams.get("messageType"); // fee-reminder | ...

    // Build dynamic filter
    const filter: any = {};
    if (channel && channel !== "all") filter.channel = channel;
    if (receiverType && receiverType !== "all") filter.receiverType = receiverType;
    if (messageType && messageType !== "all") filter.messageType = messageType;

    // Fetch filtered logs
    const logs = await CommunicationLog.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    console.log(`[CommunicationLog] ✅ Retrieved ${logs.length} logs with filters`, filter);

    return NextResponse.json({ success: true, data: logs }, { status: 200 });
  } catch (error: any) {
    console.error("[CommunicationLog] ❌ Error fetching logs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}