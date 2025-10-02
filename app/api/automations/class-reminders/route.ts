

import { connectToDB } from "@/lib/db/db";
import Student from "@/models/student.model";
import { shouldSendReminder } from "@/lib/utils/class-reminder-functions";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { fallbackTemplates, getEmailTemplate, renderTemplate, validateTemplate } from "@/lib/utils/emailTemplate";


const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN!;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;

async function sendClassReminderWhatsApp(student: any, minutesLeft: number) {
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
          to: student.phone, // ✅ WhatsApp-enabled number
          type: "template",
          template: {
            name: "class_reminder", // 👈 approved template name
            language: { code: "en_US" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: student.name }, // {{1}}
                  { type: "text", text: `${minutesLeft} minutes` }, // {{2}}
                ],
              },
            ],
          },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.warn("⚠️ Failed to send WhatsApp class reminder:", data);
    } else {
      console.log("✅ WhatsApp class reminder sent:", data);
    }
  } catch (err: any) {
    console.error("⚠️ WhatsApp error:", err.message);
  }
}


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
        // await sendReminderEmail(student, minutesLeft);
          await sendClassReminderWhatsApp(student, minutesLeft); // 👈 added
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
