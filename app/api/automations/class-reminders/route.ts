

import { connectToDB } from "@/lib/db/db";
import Student from "@/models/student.model";
import { shouldSendReminder } from "@/lib/utils/class-reminder-functions";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { fallbackTemplates, getEmailTemplate, renderTemplate, validateTemplate } from "@/lib/utils/emailTemplate";

const REQUIRED_FIELDS = ["name", "time"];

async function sendReminderEmail(student: any, minutesLeft: number) {
  try {
    const client = new TransactionalEmailsApi();
    client.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!
    );

    // 1. Fetch DB template
    let dbTemplate = await getEmailTemplate("class_reminder");

    // 2. Fallback if missing/invalid
    if (
      !dbTemplate ||
      !validateTemplate(dbTemplate.bodyHtml, REQUIRED_FIELDS)
    ) {
      console.warn("⚠️ class_reminder template missing/invalid → using fallback");
      dbTemplate = fallbackTemplates.class_reminder;
    }

    // 3. Render subject + body with dynamic placeholders
    const templateData = {
      name: student.name,
      time: `${minutesLeft} minutes`,
    };

    const subject = renderTemplate(dbTemplate.subject, templateData);
    const htmlContent = renderTemplate(dbTemplate.bodyHtml, templateData);

    // 4. Send email
    await client.sendTransacEmail({
      sender: { email: "oqa.official@gmail.com", name: "Online Quran Academy" },
      to: [{ email: student.email }],
      subject,
      htmlContent,
    });

  } catch (err: any) {
    console.warn(
      `⚠️ Failed to send reminder email to ${student.email}:`,
      err?.response?.body || err
    );
  }
}

export async function POST() {
  await connectToDB();

  const students = await Student.find({
    status: { $in: ["ongoing", "onleave"] },
  });

  let sentCount = 0;
  const results: any[] = [];

  for (const student of students) {
    try {
      const { send, minutesLeft } = shouldSendReminder(student);

      results.push({
        name: student.name,
        email: student.email,
        timezone: student.timezone,
        preferredStartTime: student.preferredStartTime,
        classDays: student.classDays,
        minutesLeft,
        reminderShouldBeSent: send,
      });

      if (send) {
        await sendReminderEmail(student, minutesLeft);
        sentCount++;
      }
    } catch (err) {
      console.error("⚠️ Skipping student due to bad data:", student._id, err);
    }
  }

  return new Response(
    JSON.stringify({ sent: sentCount, details: results }, null, 2),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
