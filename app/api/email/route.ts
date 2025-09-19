import { connectToDB } from "@/lib/db/db";
import Email from "@/models/email.model";
import { NextResponse } from "next/server";






export async function GET(req: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const event = searchParams.get("event");

    if (event) {
      const template = await Email.findOne({ event });
      if (!template) {
        return NextResponse.json({ error: "Email template not found" }, { status: 404 });
      }
      return NextResponse.json(template, { status: 200 });
    }

    // fallback → all templates
    const templates = await Email.find().sort({ createdAt: -1 });
    return NextResponse.json(templates, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}















// ✅ POST (create new email template)
export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const { event, subject, bodyHtml, bodyText, locale, updatedBy } = body;

    if (!event || !subject || !bodyHtml) {
      return NextResponse.json(
        { error: "event, subject and bodyHtml are required" },
        { status: 400 }
      );
    }

    // 🔹 Check if event already has a template
    const existing = await Email.findOne({ event });
    if (existing) {
      return NextResponse.json(
        { error: "Template for this event already exists" },
        { status: 400 }
      );
    }

    // 🔹 Save new email template
    const emailTemplate = new Email({
      event,
      subject,
      bodyHtml,
      bodyText,
      locale,
      updatedBy,
    });

    await emailTemplate.save();

    return NextResponse.json(emailTemplate, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
