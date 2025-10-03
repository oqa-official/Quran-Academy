

import { connectToDB } from "@/lib/db/db";
import Student from "@/models/student.model";
import { shouldSendReminder } from "@/lib/utils/class-reminder-functions";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { fallbackTemplates, getEmailTemplate, renderTemplate, validateTemplate } from "@/lib/utils/emailTemplate";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN!;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;

// ------------------ Student WhatsApp Reminder ------------------
async function sendClassReminderWhatsApp(student: any, minutesLeft: number) {
  if (!student?.phone) {
    console.warn(`⚠️ No student phone for ${student?.name}`);
    return;
  }
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
          to: student.phone,
          type: "template",
          template: {
            name: "class_reminder", // ✅ same template for both
            language: { code: "en_US" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: student.name }, 
                  { type: "text", text: `${minutesLeft} minutes` },
                ],
              },
            ],
          },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) console.warn("⚠️ Failed to send WhatsApp class reminder:", data);
  } catch (err: any) {
    console.error("⚠️ WhatsApp error:", err.message);
  }
}

// ------------------ Parent WhatsApp Reminder ------------------
async function sendParentClassReminderWhatsApp(parent: any, minutesLeft: number) {
  if (!parent?.phone) {
    console.warn(`⚠️ No parent phone for ${parent?.name}`);
    return;
  }
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
          to: parent.phone,
          type: "template",
          template: {
            name: "class_reminder", // ✅ same template as student
            language: { code: "en_US" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: parent.name },      
                  { type: "text", text: `${minutesLeft} minutes` }, 
                ],
              },
            ],
          },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) console.warn("⚠️ Failed to send WhatsApp parent reminder:", data);
  } catch (err: any) {
    console.error("⚠️ WhatsApp parent error:", err.message);
  }
}

// ------------------ Parent Email Reminder ------------------
async function sendParentReminderEmail(parent: any, student: any, minutesLeft: number) {
  if (!parent?.email) {
    console.warn(`⚠️ No parent email for ${parent?.name}`);
    return;
  }
  try {
    const client = new TransactionalEmailsApi();
    client.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!
    );

    let dbTemplate = await getEmailTemplate("class_reminder_parent");
    if (!dbTemplate || !validateTemplate(dbTemplate.bodyHtml, ["name", "student", "time"])) {
      console.warn("⚠️ class_reminder_parent template missing/invalid → using fallback");
      dbTemplate = {
        subject: "Reminder: {{student}}'s class in {{time}}",
        bodyHtml: "<p>Dear {{name}},</p><p>This is a reminder that {{student}}’s class will start in {{time}}.</p>"
      };
    }

    const templateData = {
      name: parent.name,
      student: student.name,
      time: `${minutesLeft} minutes`,
    };

    await client.sendTransacEmail({
      sender: { email: "oqa.official@gmail.com", name: "Online Quran Academy" },
      to: [{ email: parent.email }],
      subject: renderTemplate(dbTemplate.subject, templateData),
      htmlContent: renderTemplate(dbTemplate.bodyHtml, templateData),
    });

  } catch (err: any) {
    console.warn(`⚠️ Failed to send parent reminder email to ${parent.email}:`, err?.response?.body || err);
  }
}

// ------------------ Student Email Reminder ------------------
const REQUIRED_FIELDS = ["name", "time"];
async function sendReminderEmail(student: any, minutesLeft: number) {
  if (!student?.email) {
    console.warn(`⚠️ No student email for ${student?.name}`);
    return;
  }
  try {
    const client = new TransactionalEmailsApi();
    client.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!
    );

    let dbTemplate = await getEmailTemplate("class_reminder");
    if (!dbTemplate || !validateTemplate(dbTemplate.bodyHtml, REQUIRED_FIELDS)) {
      console.warn("⚠️ class_reminder template missing/invalid → using fallback");
      dbTemplate = fallbackTemplates.class_reminder;
    }

    const templateData = {
      name: student.name,
      time: `${minutesLeft} minutes`,
    };

    await client.sendTransacEmail({
      sender: { email: "oqa.official@gmail.com", name: "Online Quran Academy" },
      to: [{ email: student.email },  { email: "oqaabdullah@gmail.com" }],
      subject: renderTemplate(dbTemplate.subject, templateData),
      htmlContent: renderTemplate(dbTemplate.bodyHtml, templateData),
    });

  } catch (err: any) {
    console.warn(`⚠️ Failed to send reminder email to ${student.email}:`, err?.response?.body || err);
  }
}

// ------------------ Main Cron/Trigger ------------------
export async function POST() {
  await connectToDB();

  const students = await Student.find({
    status: { $in: ["ongoing", "onleave"] },
  }).populate("parentInquiry"); // ✅ populate parent details

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
        parent: student.parentInquiry ? {
          name: student.parentInquiry.name,
          email: student.parentInquiry.email,
          phone: student.parentInquiry.phone,
        } : null
      });

      if (send) {
        // Student reminders
        await sendReminderEmail(student, minutesLeft);
        await sendClassReminderWhatsApp(student, minutesLeft);

        // Parent reminders
        if (student.parentInquiry) {
          await sendParentReminderEmail(student.parentInquiry, student, minutesLeft);
          await sendParentClassReminderWhatsApp(student.parentInquiry, minutesLeft);
        }

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





