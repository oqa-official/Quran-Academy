import { connectToDB } from "@/lib/db/db";
import { fallbackTemplates, getEmailTemplate, renderTemplate, validateTemplate } from "@/lib/utils/emailTemplate";
import Inquire from "@/models/inquire.model";
import Student from "@/models/student.model";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { NextResponse } from "next/server";

const REQUIRED_FIELDS = ["name", "onboardingLink"];

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
      to: [{ email: inquire.email }],
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

export async function POST() {
  await connectToDB();

  // 1. Find all inquiries
  const allInquiries = await Inquire.find();

  let sentCount = 0;
  const results: any[] = [];

  // 2. Loop through and check if they have students
  for (const inquire of allInquiries) {
    const students = await Student.find({ parentInquiry: inquire._id });

    if (students.length === 0) {
      try {
        await sendOnboardingReminderEmail(inquire);
        sentCount++;

        results.push({
          name: inquire.name,
          email: inquire.email,
          onboardingLink: `${process.env.APP_URL}/onboarding/${inquire._id}`,
        });
      } catch (err: any) {
        console.error(`❌ Failed to send onboarding reminder to ${inquire.email}:`, err.message);
      }
    }
  }

  return NextResponse.json({ sent: sentCount, reminders: results }, { status: 200 });
}
