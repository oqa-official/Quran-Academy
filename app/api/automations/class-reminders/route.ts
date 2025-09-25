import { connectToDB } from "@/lib/db/db";
import Student from "@/models/student.model";
import { shouldSendReminder } from "@/lib/utils/class-reminder-functions";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";

// ✅ simple static template
async function sendReminderEmail(student: any, minutesLeft: number) {
  try {
    const client = new TransactionalEmailsApi();
    client.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

    const subject = `Your class starts soon`;
    const htmlContent = `
      <p>Hey ${student.name},</p>
      <p>Your class will start in <strong>${minutesLeft} minutes</strong>.</p>
      <p>Please be ready and join the meeting on time.</p>
    `;

    await client.sendTransacEmail({
      sender: { email: "oqa.official@gmail.com", name: "Online Quran Academy" },
      to: [{ email: student.email }],
      subject,
      htmlContent,
    });

    console.log(`📧 Email sent to ${student.email}`);
  } catch (err: any) {
    console.warn(`⚠️ Failed to send email to ${student.email}:`, err?.response?.body || err);
  }
}

export async function GET() {
  await connectToDB();

  const students = await Student.find({
    status: { $in: ["ongoing", "onleave"] }, // adjust filter if needed
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

  return new Response(JSON.stringify({ sent: sentCount, details: results }, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
