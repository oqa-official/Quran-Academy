import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { NextResponse } from "next/server";
import Instructor from "@/models/instructor.model";
import { connectToDB } from "@/lib/db/db";
import { generateInstructorEducationMail, generateInstructorPassword, generateInstructorUserId } from "@/lib/utils/instructorHelpers";
import mongoose from "mongoose";
import { fallbackTemplates, getEmailTemplate, renderTemplate, validateTemplate } from "@/lib/utils/emailTemplate";

// ✅ GET all instructors
export async function GET() {
  try {
    await connectToDB();
    const instructors = await Instructor.find();
    return NextResponse.json(instructors, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


const REQUIRED_FIELDS = ["name", "userId", "educationMail", "password"];

export async function sendInstructorCredentialsEmail(user: any) {
  try {
    const client = new TransactionalEmailsApi();
    client.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

    // 1. Fetch DB template
    let dbTemplate = await getEmailTemplate("instructor_created");

    // 2. If missing or invalid, fallback
    if (!dbTemplate || !validateTemplate(dbTemplate.bodyHtml, REQUIRED_FIELDS)) {
      console.warn("⚠️ instructor_added template missing/invalid → using fallback");
      dbTemplate = fallbackTemplates.instructor_added;
    }

    // 3. Render template with dynamic user values
    const subject = renderTemplate(dbTemplate.subject, user);
    const htmlContent = renderTemplate(dbTemplate.bodyHtml, user);

    const emailData = {
      sender: { email: "oqa.official@gmail.com", name: "Online Quran Academy" },
      to: [{ email: user.email }],
      subject,
      htmlContent,
    };

    const result = await client.sendTransacEmail(emailData);
  } catch (err: any) {
    console.warn("⚠️ Failed to send instructor email:", err?.response?.body || err);
  }
}




export async function POST(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();

    const { name, number, emergencyNumber, email, image, cloudinaryImageId, designation, about, qualifications } = body;

    if (!name || !number || !email) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    // Generate auto fields
    const userId = await generateInstructorUserId();
    const educationMail = await generateInstructorEducationMail(name);
    const password = generateInstructorPassword(name);

    const newInstructor = new Instructor({
      name,
      number,
      emergencyNumber,
      email,
      image,
      cloudinaryImageId,
      designation,
      about,
      qualifications,
      userId,
      educationMail,
      password,
    });

    await newInstructor.save();

    // ✅ Send email independently (do not block API response)
    sendInstructorCredentialsEmail(newInstructor);

    return NextResponse.json(newInstructor, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error in POST /api/db/instructors:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
