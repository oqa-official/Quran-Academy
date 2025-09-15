// import { NextResponse } from "next/server";
// import { connectToDB } from "@/lib/db/db";
// import Student from "@/models/student.model";
// import Instructor from "@/models/instructor.model";
// import Brevo from "@getbrevo/brevo";

// export async function POST(req: Request) {
//   try {

//     await connectToDB();

//     const { identifier } = await req.json();

//     if (!identifier) {
//       console.warn("❌ Identifier missing in request");
//       return NextResponse.json(
//         { error: "Identifier is required" },
//         { status: 400 }
//       );
//     }

//     let user: any = null;
//     let role = "";

//     // 🔍 Check Instructor
//     user = await Instructor.findOne({
//       $or: [{ userId: identifier }, { educationMail: identifier }],
//     });
//     if (user) role = "teacher";

//     // 🔍 If not found, check Student
//     if (!user) {
//       user = await Student.findOne({
//         $or: [{ userId: identifier }, { educationMail: identifier }],
//       });
//       if (user) role = "student";
//     }

//     if (!user) {
//       return NextResponse.json(
//         { error: "No account found with this identifier." },
//         { status: 404 }
//       );
//     }


//     // ✅ Setup Brevo client
//     const client = new Brevo.TransactionalEmailsApi();
//     client.setApiKey(
//       Brevo.TransactionalEmailsApiApiKeys.apiKey,
//       process.env.BREVO_API_KEY! // must be set in .env.local
//     );

//      const result = await client.sendTransacEmail({
//     sender: { email: "ahmadwebcrafts@gmail.com", name: "Quran Academy" },
//     to: [{ email: user.email }],
//     subject: "Account Recovery - Quran Academy",
//     htmlContent: `...`,
//   });
//     // ✅ Send password
//     const emailData = {
//       sender: { email: "ahmadwebcrafts@gmail.com", name: "Quran Academy" },
//       to: [{ email: user.email }],
//       subject: "Account Recovery - Quran Academy",
//       htmlContent: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.5;">
//           <h2>Account Recovery</h2>
//           <p>Dear ${user.name || "User"},</p>
//           <p>You requested account recovery. Here are your credentials:</p>
//           <p><b>User ID:</b> ${user.userId}</p>
//           <p><b>Email:</b> ${user.email}</p>
//           <p><b>Password:</b> ${user.password}</p>
//           <br/>
//           <p style="color:#555;">Please keep your credentials safe.</p>
//         </div>
//       `,
//     };

//     const response = await client.sendTransacEmail(emailData);

//     return NextResponse.json(
//       { message: "Password has been sent to your email.", role },
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("❌ Forgot Password Error:", err?.response?.body || err);
//     return NextResponse.json(
//       { error: err?.response?.body?.message || "Server error" },
//       { status: 500 }
//     );
//   }
// }















import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import Student from "@/models/student.model";
import Instructor from "@/models/instructor.model";
import Brevo from "@getbrevo/brevo";

export async function POST(req: Request) {
  try {

    await connectToDB();

    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json({ error: "Identifier is required" }, { status: 400 });
    }

    let user: any = null;
    let role = "";

    // 🔍 Check Instructor
    user = await Instructor.findOne({
      $or: [{ userId: identifier }, { educationMail: identifier }],
    });
    if (user) role = "teacher";

    // 🔍 If not found, check Student
    if (!user) {
      user = await Student.findOne({
        $or: [{ userId: identifier }, { educationMail: identifier }],
      });
      if (user) role = "student";
    }

    if (!user) {
      return NextResponse.json({ error: "No account found with this identifier." }, { status: 404 });
    }


    // ✅ Setup Brevo client
    const client = new Brevo.TransactionalEmailsApi();
    client.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

    const emailData = {
      sender: { email: "ahmadwebcrafts@gmail.com", name: "Quran Academy" },
      to: [{ email: user.email }],
      subject: "Account Recovery - Quran Academy",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Account Recovery</h2>
          <p>Dear ${user.name || "User"},</p>
          <p>You requested account recovery. Here are your credentials:</p>
          <p><b>User ID:</b> ${user.userId}</p>
          <p><b>Email:</b> ${user.email}</p>
          <p><b>Password:</b> ${user.password}</p>
          <br/>
          <p style="color:#555;">Please keep your credentials safe.</p>
        </div>
      `,
    };


    try {
      const response = await client.sendTransacEmail(emailData);
      console.log("✅ Brevo email response:", response);
    } catch (emailErr: any) {
      // ⚠️ Log the error but do not fail the API response
      console.warn("⚠️ Email could not be sent:", emailErr?.response?.body || emailErr);
    }

    // ✅ Respond success regardless of email delivery
    return NextResponse.json(
      { message: "Password has been sent to your email ", role },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ Forgot Password Error:", err?.response?.body || err);
    return NextResponse.json({ error: err?.response?.body?.message || "Server error" }, { status: 500 });
  }
}
