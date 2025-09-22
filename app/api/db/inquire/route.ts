import { connectToDB } from "@/lib/db/db";
import Inquire from "@/models/inquire.model";
import { NextResponse } from "next/server";


// lib/email/inquiry.ts
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { fallbackTemplates, getEmailTemplate, renderTemplate, validateTemplate } from "@/lib/utils/emailTemplate";

const REQUIRED_FIELDS = ["name", "link"];

async function sendInquiryEmail(user: any) {
  try {
    const client = new TransactionalEmailsApi();
    client.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!
    );

    // 1. Fetch DB template
    let dbTemplate = await getEmailTemplate("inquiry_fill");

    // 2. Fallback if missing or invalid
    if (!dbTemplate || !validateTemplate(dbTemplate.bodyHtml, REQUIRED_FIELDS)) {
      console.warn("⚠️ inquiry_fill template missing/invalid → using fallback");
      dbTemplate = fallbackTemplates.inquiry_fill;
    }

    // 3. Render subject + body with dynamic placeholders
    const subject = renderTemplate(dbTemplate.subject, user);
    const htmlContent = renderTemplate(dbTemplate.bodyHtml, user);

    const emailData = {
      sender: { email: "oqa.official@gmail.com", name: "Online Quran Academy" },
      to: [{ email: user.email }],
      subject,
      htmlContent,
    };

    await client.sendTransacEmail(emailData);
  } catch (err: any) {
    console.warn("⚠️ Failed to send inquiry email:", err?.response?.body || err);
  }
}




// ✅ GET all inquiries
export async function GET() {
  try {
    await connectToDB();
    const inquires = await Inquire.find().sort({ createdAt: -1 });
    return NextResponse.json(inquires, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const { name, email, phone } = body;
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 🔹 Check if phone OR email already exists
    const existing = await Inquire.findOne({
      $or: [{ phone }, { email }],
    });

    if (existing) {
      return NextResponse.json(
        { error: "Number or Email already exists, try again with a different one." },
        { status: 400 }
      );
    }

    // 🔹 Save new inquiry
    const inquire = new Inquire({ name, email, phone });
    await inquire.save();

    // 🔹 Build onboarding link
    const onboardingLink = `https://quran-academy-online.vercel.app/onboarding/${inquire._id}`;

    // 🔹 Fire email independently (non-blocking)
    sendInquiryEmail({
      name: inquire.name,
      email: inquire.email,
      link: onboardingLink,
    });

    return NextResponse.json(inquire, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
