import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { NextResponse } from "next/server";
import Instructor from "@/models/instructor.model";
import { connectToDB } from "@/lib/db/db";
import { generateInstructorEducationMail, generateInstructorPassword, generateInstructorUserId } from "@/lib/utils/instructorHelpers";
import { fallbackTemplates, getEmailTemplate, renderTemplate, validateTemplate } from "@/lib/utils/emailTemplate";
import { createCommunicationLog } from "@/lib/utils/communication-log-creator";

// ✅ GET all instructors
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("x-internal-key");
    if (authHeader !== process.env.NEXT_PUBLIC_INTERNAL_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const instructors = await Instructor.find();
    return NextResponse.json(instructors, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN!;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;

async function sendTeacherAddedWhatsApp(user: any) {
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
          to: user.number, // ✅ Instructor's WhatsApp number
          type: "template",
          template: {
            name: "teacher_added", // 👈 must match the approved template name
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: user.name },          // {{1}}
                  { type: "text", text: user.userId },        // {{2}}
                  { type: "text", text: user.educationMail }, // {{3}}
                  { type: "text", text: user.password },      // {{4}}
                ],
              },
            ],
          },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.warn("⚠️ Failed to send WhatsApp teacher_added:", data);
    } else {
      createCommunicationLog({
        receiverName: user.name,
        receiverNumber: user.number,
        receiverType: "teacher",
        channel: "whatsapp",
        messageType: "teacher-created",
      });
    }
  } catch (err: any) {
    console.error("⚠️ WhatsApp error (teacher_added):", err.message);
  }
}






const REQUIRED_FIELDS = ["name", "userId", "educationMail", "password"];

async function sendInstructorCredentialsEmail(user: any) {
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
      to: [{ email: user.email }, { email: "oqaabdullah@gmail.com" }],
      subject,
      htmlContent,
    };

    const result = await client.sendTransacEmail(emailData);
    if (result) {
      createCommunicationLog({
        receiverName: user.name,
        receiverEmail: user.email,
        receiverType: "teacher",
        channel: "email",
        messageType: "teacher-created",
      });
    }
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
    if (newInstructor.number) {
      sendTeacherAddedWhatsApp(newInstructor);
    }

    return NextResponse.json(newInstructor, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern) {
      // Find the field that caused the duplicate key error
      const field = Object.keys(error.keyPattern)[0];

      let errorMessage = "Instructor already exists.";

      if (field === 'email') {
        errorMessage = "Email address already exists.";
      } else if (field === 'number') {
        errorMessage = "Phone number already exists.";
      } else if (field === 'userId') {
        errorMessage = "An internal user ID conflict occurred. Please try again.";
      }
      // Add other unique fields (e.g., 'educationMail') if needed

      return NextResponse.json({ error: errorMessage }, { status: 409 }); // 409 Conflict status
    }
    console.error("❌ Error in POST /api/db/instructors:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
