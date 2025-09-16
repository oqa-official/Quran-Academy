

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import Student from "@/models/student.model";
import Instructor from "@/models/instructor.model";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { identifier } = await req.json();

    if (!identifier) return NextResponse.json({ error: "Identifier is required" }, { status: 400 });

    let user: any = null;
    let role = "";

    user = await Instructor.findOne({
      $or: [{ userId: identifier }, { educationMail: identifier }],
    });
    if (user) role = "teacher";

    if (!user) {
      user = await Student.findOne({
        $or: [{ userId: identifier }, { educationMail: identifier }],
      });
      if (user) role = "student";
    }

    if (!user) return NextResponse.json({ error: "No account found." }, { status: 404 });

    const client = new TransactionalEmailsApi();
    client.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

    const emailData = {
      sender: { email: "oqa.official@gmail.com", name: "Online Quran Academy" },
      to: [{ email: user.email }],
      subject: "Account Recovery - Quran Academy",
      htmlContent: `
        <div>
          <p>Dear ${user.name || "User"},</p>
          <p>Your credentials:</p>
          <p>User ID: ${user.userId}</p>
          <p>Email: ${user.email}</p>
          <p>Password: ${user.password}</p>
        </div>
      `,
    };

    try {
      const result = await client.sendTransacEmail(emailData);
    } catch (emailErr:any) {
      // console.log("error in email sending", emailErr.response)
    }

    return NextResponse.json({ message: "Acount recovery instructions sent to the respectuve email address", role }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
