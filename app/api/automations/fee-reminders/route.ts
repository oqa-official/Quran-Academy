import { connectToDB } from "@/lib/db/db";
import { fallbackTemplates, getEmailTemplate, renderTemplate, validateTemplate } from "@/lib/utils/emailTemplate";
import Inquire from "@/models/inquire.model";
import Student from "@/models/student.model";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { NextResponse } from "next/server";

const REQUIRED_FIELDS = ["name", "dueDate", "extendedDueDate"];

async function sendFeeReminderEmail(inquire: any) {
  try {
    const client = new TransactionalEmailsApi();
    client.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!
    );

    // 1. Fetch DB template
    let dbTemplate = await getEmailTemplate("fee_reminder");

    // 2. Fallback if missing/invalid
    if (
      !dbTemplate ||
      !validateTemplate(dbTemplate.bodyHtml, REQUIRED_FIELDS)
    ) {
      console.warn("⚠️ fee_reminder template missing/invalid → using fallback");
      dbTemplate = fallbackTemplates.fee_reminder;
    }

    // 3. Prepare template data
    const templateData = {
      name: inquire.name,
      dueDate: new Date(inquire.dueDate).toLocaleDateString("en-US"),
      extendedDueDate: inquire.extendedDueDate
        ? new Date(inquire.extendedDueDate).toLocaleDateString("en-US")
        : "N/A",
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

    console.log(`📧 Fee reminder sent to ${inquire.email}`);
  } catch (err: any) {
    console.warn(
      `⚠️ Failed to send fee reminder to ${inquire.email}:`,
      err?.response?.body || err
    );
  }
}



export async function POST() {
  await connectToDB();

  const today = new Date();

  // 1. Find inquiries where dueDate <= today <= extendedDueDate
  const dueInquiries = await Inquire.find({
    dueDate: { $lte: today },
    extendedDueDate: { $gte: today },
  });

  let sentCount = 0;
  const results: any[] = [];

  // 2. Iterate and send emails only if they have active students
  for (const inquire of dueInquiries) {
    // 🔎 Count students who are not quit
    const studentCount = await Student.countDocuments({
      parentInquiry: inquire._id,
      status: { $ne: "quit" },
    });

    if (studentCount > 0) {
      try {
        await sendFeeReminderEmail(inquire);
        sentCount++;

        results.push({
          name: inquire.name,
          email: inquire.email,
          dueDate: inquire.dueDate,
          extendedDueDate: inquire.extendedDueDate,
          studentCount, // ✅ now included in response
        });
      } catch (err: any) {
        console.error(`❌ Failed to send email to ${inquire.email}:`, err.message);
      }
    } else {
      console.log(`⏩ Skipped ${inquire.email} — no active students`);
    }
  }

  return NextResponse.json(
    { sent: sentCount, reminders: results },
    { status: 200 }
  );
}











