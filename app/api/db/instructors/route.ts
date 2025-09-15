import { NextResponse } from "next/server";
import Instructor from "@/models/instructor.model";
import { connectToDB } from "@/lib/db/db";
import { generateInstructorEducationMail, generateInstructorPassword, generateInstructorUserId } from "@/lib/utils/instructorHelpers";
import mongoose from "mongoose";

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





// export async function POST(req: Request) {
//   try {
//     await connectToDB();
//     const body = await req.json();

//     const {
//       name,
//       number,
//       emergencyNumber,
//       email,
//       image,
//       cloudinaryImageId,
//       designation,
//       about,
//       qualifications,
//       password: incomingPassword,
//     } = body;

//     // ✅ Required validations
//     if (!name || !number  || !email) {
//       return NextResponse.json(
//         { error: "Required fields are missing" },
//         { status: 400 }
//       );
//     }

//     // ✅ Auto fields
//     const userId = await generateInstructorUserId();
//     const educationMail = await generateInstructorEducationMail(name);
//     const password =generateInstructorPassword(name);

//     const newInstructor = new Instructor({
//       name,
//       number,
//       emergencyNumber,
//       email,
//       image,
//       cloudinaryImageId,
//       designation,
//       about,
//       qualifications,
//       userId,
//       educationMail,
//       password,
//     });

//     await newInstructor.save();

//     return NextResponse.json(newInstructor, { status: 201 });
//   } catch (error: any) {
//     console.error("❌ Error in POST /api/db/instructors:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }














import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";

// ✅ Email sender function
async function sendInstructorCredentialsEmail(user: any) {
  try {
    const client = new TransactionalEmailsApi();
    client.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

    const emailData = {
      sender: { email: "ahmadwebcrafts@gmail.com", name: "Quran Academy" },
      to: [{ email: user.email }],
      subject: "Your Instructor Account Credentials",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Welcome ${user.name}</h2>
          <p>Your instructor account has been created successfully. Here are your credentials:</p>
          <p><b>Educational Email:</b> ${user.educationMail}</p>
          <p><b>User ID:</b> ${user.userId}</p>
          <p><b>Password:</b> ${user.password}</p>
          <p>Please keep this information safe.</p>
        </div>
      `,
    };

    const result = await client.sendTransacEmail(emailData);
    console.log("✅ Instructor email sent successfully:", result);
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
