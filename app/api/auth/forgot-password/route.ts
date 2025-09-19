
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import Student from "@/models/student.model";
import Instructor from "@/models/instructor.model";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { getEmailTemplate, renderTemplate, validateTemplate } from "@/lib/utils/emailTemplate";
import { fallbackTemplates } from "@/lib/utils/emailTemplate";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json({ error: "Identifier is required" }, { status: 400 });
    }

    let user: any = null;
    let role = "";

    // Instructor
    user = await Instructor.findOne({
      $or: [{ userId: identifier }, { educationMail: identifier }],
    });
    if (user) role = "teacher";

    // Student
    if (!user) {
      user = await Student.findOne({
        $or: [{ userId: identifier }, { educationMail: identifier }],
      });
      if (user) role = "student";
    }

    if (!user) {
      return NextResponse.json({ error: "No account found." }, { status: 404 });
    }

    const client = new TransactionalEmailsApi();
    client.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

    // Required fields
    const requiredFields = ["name", "email", "userId", "password"];
    

    // ✅ 1. Fetch DB template
    let template = await getEmailTemplate("forgot_password");

    // ✅ 2. Fallback if invalid
    if (
      !template ||
      !validateTemplate(template.bodyHtml, requiredFields) ||
      !validateTemplate(template.subject, ["name"])
    ) {
      template = fallbackTemplates.forgot_password;
      console.log("rendering fallback template")
    }

    // ✅ 3. Render subject + body
    const data = {
      name: user.name,
      email: user.educationMail,
      userId: user.userId,
      password: user.password,
      role,
    };



    const subject = renderTemplate(template.subject, data);
    const htmlContent = renderTemplate(template.bodyHtml, data);

    // ✅ 4. Send email
    const emailData = {
      sender: { email: "oqa.official@gmail.com", name: "Online Quran Academy" },
      to: [{ email: user.email }],
      subject,
      htmlContent,
    };


    await client.sendTransacEmail(emailData);

    return NextResponse.json(
      { message: "Recovery email sent successfully", role },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
