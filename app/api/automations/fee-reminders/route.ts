import { connectToDB } from "@/lib/db/db";
import { createCommunicationLog } from "@/lib/utils/communication-log-creator";
import { fallbackTemplates, getEmailTemplate, renderTemplate, validateTemplate } from "@/lib/utils/emailTemplate";
import Inquire from "@/models/inquire.model";
import Student from "@/models/student.model";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { NextResponse } from "next/server";

const REQUIRED_FIELDS = ["name", "dueDate", "extendedDueDate"];

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN!;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;

async function sendFeeReminderWhatsApp(inquire: any) {
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
          to: inquire.phone, // ✅ must be WhatsApp-enabled number
          type: "template",
          template: {
            name: "fee_reminder", // 👈 your approved template name
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: inquire.name }, // {{1}}
                  { 
                    type: "text", 
                    text: new Date(inquire.dueDate).toLocaleDateString("en-US") 
                  }, // {{2}}
                  { 
                    type: "text", 
                    text: inquire.extendedDueDate 
                      ? new Date(inquire.extendedDueDate).toLocaleDateString("en-US")
                      : "N/A" 
                  }, // {{3}}
                ],
              },
            ],
          },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.warn("⚠️ Failed to send WhatsApp fee reminder:", data);
    } else {
      createCommunicationLog({
        receiverName: inquire.name,
        receiverNumber: inquire.phone,
        receiverType: "parent",
        channel: "whatsapp",
        messageType: "fee-reminder",
      });
    }
  } catch (err: any) {
    console.error("⚠️ WhatsApp error:", err.message);
  }
}




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
      to: [{ email: inquire.email },  
        // { email: "oqaabdullah@gmail.com" }
      ],
      subject,
      htmlContent,
    });

    createCommunicationLog({
      receiverName: inquire.name,
      receiverEmail: inquire.email,
      receiverType: "parent",
      channel: "email",
      messageType: "fee-reminder",
    });
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
        await sendFeeReminderWhatsApp(inquire); // 👈 added here

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











