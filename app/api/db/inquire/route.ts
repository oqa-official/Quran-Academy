import { connectToDB } from "@/lib/db/db";
import Inquire from "@/models/inquire.model";
import { NextResponse } from "next/server";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN!;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;


async function sendInquiryWhatsApp(user: { name: string; phone: string; link: string }) {
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
          to: user.phone, // number like 92300..., no +
          type: "template",
          template: {
            name: "inquiry_fill",
            language: { code: "en_GB" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: user.name },     // {{1}}
                  { type: "text", text: user.link },     // {{2}} full URL
                ],
              },
            ],
          },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.warn("⚠️ Failed to send WhatsApp:", data);
    } else {
      console.log("✅ WhatsApp sent:");
    }
  } catch (err: any) {
    console.warn("⚠️ WhatsApp error:", err.message);
  }
}





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
      to: [{ email: user.email }, { email: "oqaabdullah@gmail.com" }, ],
      subject,
      htmlContent,
    };



    await client.sendTransacEmail(emailData);
  } catch (err: any) {
    console.warn("⚠️ Failed to send inquiry email:", err?.response?.body || err);
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

    sendInquiryWhatsApp({
      name: inquire.name,
      phone: inquire.phone,
      link: onboardingLink,
    });



    return NextResponse.json(inquire, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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





// // DELETE all students
// export async function DELETE() {
//   try {
//     await connectToDB();
//     const inquiry = await Inquire.deleteMany({});
//     return NextResponse.json({ success: true, message: "All Inquiry deleted" });
//   } catch (error) {
//     console.error("Error deleting students:", error);
//     return NextResponse.json({ success: false, error: "Failed to delete Inquiries" }, { status: 500 });
//   }
// }
