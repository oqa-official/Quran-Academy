import { connectToDB } from "@/lib/db/db";
import { fallbackTemplates, getEmailTemplate, renderTemplate, validateTemplate } from "@/lib/utils/emailTemplate";
import Inquire from "@/models/inquire.model";
import Student from "@/models/student.model";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { NextResponse } from "next/server";

const REQUIRED_FIELDS = ["name", "onboardingLink"];
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN!;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;

async function sendOnboardingReminderEmail(inquire: any) {
  try {
    const client = new TransactionalEmailsApi();
    client.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!
    );

    // 1. Fetch DB template
    let dbTemplate = await getEmailTemplate("onBoarding_reminder");

    // 2. Fallback if missing/invalid
    if (
      !dbTemplate ||
      !validateTemplate(dbTemplate.bodyHtml, REQUIRED_FIELDS)
    ) {
      console.warn("⚠️ onBoarding_reminder template missing/invalid → using fallback");
      dbTemplate = fallbackTemplates.onBoarding_reminder;
    }

    // 3. Prepare template data
    const onboardingLink = `${process.env.APP_URL
    }/onboarding/${inquire._id}`;
    const templateData = {
      name: inquire.name,
      onboardingLink,
    };

    const subject = renderTemplate(dbTemplate.subject, templateData);
    const htmlContent = renderTemplate(dbTemplate.bodyHtml, templateData);

    // 4. Send email
    await client.sendTransacEmail({
      sender: { email: "oqa.official@gmail.com", name: "Online Quran Academy" },
      to: [{ email: inquire.email },  { email: "oqaabdullah@gmail.com" }],
      subject,
      htmlContent,
    });

  } catch (err: any) {
    console.warn(
      `⚠️ Failed to send onboarding reminder to ${inquire.email}:`,
      err?.response?.body || err
    );
  }
}

async function sendOnboardingReminderWhatsApp(inquire: any) {
  try {
    const onboardingLink = `${process.env.APP_URL}/onboarding/${inquire._id}`;

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
          to: inquire.phone.startsWith("+") ? inquire.phone : `+${inquire.phone}`,
          type: "template",
          template: {
            name: "onboarding_reminder", 
            language: { code: "en_GB" }, 
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: inquire.name },       // {{1}}
                  { type: "text", text: onboardingLink },     // {{2}}
                ],
              },
            ],
          },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.warn(`⚠️ Failed WhatsApp onboarding reminder to ${inquire.phone}:`, data);
    } else {
      console.log(`✅ WhatsApp onboarding reminder sent to ${inquire.phone}`);
    }
  } catch (err: any) {
    console.warn(`⚠️ WhatsApp error for ${inquire.phone}:`, err.message);
  }
}

export async function POST() {
  await connectToDB();

  const allInquiries = await Inquire.find();
  let sentCount = 0;
  const results: any[] = [];

  for (const inquire of allInquiries) {
    const students = await Student.find({ parentInquiry: inquire._id });

    if (students.length === 0) {
      try {
        await sendOnboardingReminderEmail(inquire);
        await sendOnboardingReminderWhatsApp(inquire); // 👈 also fire WhatsApp
        sentCount++;

        results.push({
          name: inquire.name,
          email: inquire.email,
          phone: inquire.phone,
          onboardingLink: `${process.env.APP_URL}/onboarding/${inquire._id}`,
        });
      } catch (err: any) {
        console.error(`❌ Failed to send onboarding reminder to ${inquire.email}:`, err.message);
      }
    }
  }

  return NextResponse.json({ sent: sentCount, reminders: results }, { status: 200 });
}