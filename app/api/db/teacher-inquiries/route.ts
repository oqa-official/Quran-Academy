import { NextResponse } from "next/server";
import mongoose from "mongoose"; import { connectToDB } from "@/lib/db/db";
import teacherInquiryModel from "@/models/teacher-inquiry.model"
// lib/email/teacherInquiry.ts
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { fallbackTemplates, getEmailTemplate, renderTemplate, validateTemplate } from "@/lib/utils/emailTemplate";


const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN!;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;

async function sendCareerRequestWhatsApp(user: any) {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: user.phone, // applicant's WhatsApp number
          type: "template",
          template: {
            name: "career_request", // must match exactly
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: user.name }, // {{1}}
                ],
              },
              // ✅ Optional: only if your approved template button expects a parameter
              // {
              //   type: "button",
              //   sub_type: "url",
              //   index: 0,
              //   parameters: [{ type: "text", text: "12345" }],
              // },
            ],
          },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.warn("⚠️ Failed to send WhatsApp career_request:", data);
    } else {
      console.log("✅ WhatsApp career_request sent:", data);
    }
  } catch (err: any) {
    console.error("⚠️ WhatsApp error (career_request):", err.message);
  }
}






const REQUIRED_FIELDS = ["name"];
async function sendTeacherInquiryEmail(user: any) {
  try {
    const client = new TransactionalEmailsApi();
    client.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!
    );

    // 1. Fetch DB template
    let dbTemplate = await getEmailTemplate("teacher_inquiry");

    // 2. If missing/invalid → fallback
    if (!dbTemplate || !validateTemplate(dbTemplate.bodyHtml, REQUIRED_FIELDS)) {
      console.warn("⚠️ teacher_inquiry template missing/invalid → using fallback");
      dbTemplate = fallbackTemplates.teacher_inquiry;
    }

    // 3. Render template with dynamic user values
    const subject = renderTemplate(dbTemplate.subject, user);
    const htmlContent = renderTemplate(dbTemplate.bodyHtml, user);

    const emailData = {
      sender: { email: "oqa.official@gmail.com", name: "Online Quran Academy" },
      to: [{ email: user.email }, { email: "oqaabdullah@gmail.com" }],
      subject,
      htmlContent,
    };

    await client.sendTransacEmail(emailData);
  } catch (err: any) {
    console.warn("⚠️ Failed to send teacher inquiry email:", err?.response?.body || err);
  }
}





export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    // Create new inquiry
    const newInquiry = await teacherInquiryModel.create(body);

    // ✅ Fire off email (non-blocking)
    sendTeacherInquiryEmail(newInquiry);
    if (newInquiry.phone) {
      sendCareerRequestWhatsApp(newInquiry);
    }

    return NextResponse.json(
      { success: true, data: newInquiry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /teacher-inquiries error:", error);

    // Handle duplicate email error
    if (error.code === 11000 && error.keyValue?.email) {
      return NextResponse.json(
        { success: false, message: "Email already exists." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}












// 🟢 GET - Fetch All Teacher Inquiries
export async function GET() {
  try {
    await connectToDB();

    const inquiries = await teacherInquiryModel.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: inquiries },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /teacher-inquiries error:", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
