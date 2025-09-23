import { NextResponse } from "next/server";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import { connectToDB } from "@/lib/db/db";
import Admin from "@/models/admin.model";
import instructorModel from "@/models/instructor.model";
import studentModel from "@/models/student.model";
import { renderTemplate, validateTemplate } from "@/lib/utils/emailTemplate";



// Required placeholders in template
const REQUIRED_FIELDS = ["name"];

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { types, subCategories, subject, bodyHtml } = await req.json();

    if (!subject || !bodyHtml) {
      return NextResponse.json({ error: "Subject and body are required" }, { status: 400 });
    }

    const recipients: any[] = [];

    // ✅ Handle ALL
    if (types.includes("all")) {
      const [admins, teachers, students] = await Promise.all([
        Admin.find({}, "name email educationMail"),
        instructorModel.find({}, "name email educationMail"),
        studentModel.find({}, "name email educationMail status"),
      ]);
      recipients.push(...admins, ...teachers, ...students);
    } else {
      // ✅ Handle Admins
      if (types.includes("admins")) {
        const admins = await Admin.find({}, "name email educationMail");
        recipients.push(...admins);
      }

      // ✅ Handle Teachers
      if (types.includes("teachers")) {
        const teachers = await instructorModel.find({}, "name email educationMail");
        recipients.push(...teachers);
      }

      // ✅ Handle Students (with subcategory filter)
      if (types.includes("students")) {
        let query: any = {};
        if (subCategories?.length > 0) {
          query.status = { $in: subCategories };
        }
        const students = await studentModel.find(query, "name email educationMail status");
        recipients.push(...students);
      }
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No recipients found" }, { status: 404 });
    }

    // ✅ Setup Brevo client
    const client = new TransactionalEmailsApi();
    client.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

    // ✅ Get template
    const dbTemplate = { subject, bodyHtml };
    if (!validateTemplate(dbTemplate.bodyHtml, REQUIRED_FIELDS)) {
      return NextResponse.json({ error: "Template missing required fields" }, { status: 400 });
    }

    // ✅ Send emails
    const sendResults = [];
    for (const user of recipients) {
      try {
        const renderedSubject = renderTemplate(dbTemplate.subject, user);
        const renderedHtml = renderTemplate(dbTemplate.bodyHtml, user);

        if (!renderedHtml || !renderedSubject) continue;

        const emailData = {
          sender: { email: "oqa.official@gmail.com", name: "Online Quran Academy" },
          to: [{ email: user.email }],
          subject: renderedSubject,
          htmlContent: renderedHtml,
        };

        const result = await client.sendTransacEmail(emailData);
        sendResults.push({ email: user.email, status: "sent", id: result?.body.messageId });
      } catch (err: any) {
        sendResults.push({ email: user.email, status: "failed", error: err?.message });
      }
    }

    return NextResponse.json({
      message: `Emails sent to ${sendResults.length} recipients`,
      results: sendResults,
    });
  } catch (err: any) {
    console.error("❌ Custom email sending failed:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}























// import { NextResponse } from "next/server";
// import { connectToDB } from "@/lib/db/db";
// import Admin from "@/models/admin.model";
// import instructorModel from "@/models/instructor.model";
// import studentModel from "@/models/student.model";
// import { renderTemplate, validateTemplate } from "@/lib/utils/emailTemplate";

// // Required placeholders in template
// const REQUIRED_FIELDS = ["name"];

// export async function POST(req: Request) {
//   try {
//     await connectToDB();
//     const { types, subCategories, subject, bodyHtml } = await req.json();

//     if (!subject || !bodyHtml) {
//       return NextResponse.json({ error: "Subject and body are required" }, { status: 400 });
//     }

//     const recipients: any[] = [];

//     // ✅ Handle ALL
//     if (types.includes("all")) {
//       const [admins, teachers, students] = await Promise.all([
//         Admin.find({}, "name email educationMail"),
//         instructorModel.find({}, "name email educationMail"),
//         studentModel.find({}, "name email educationMail status"),
//       ]);
//       recipients.push(...admins, ...teachers, ...students);
//     } else {
//       if (types.includes("admins")) {
//         const admins = await Admin.find({}, "name email educationMail");
//         recipients.push(...admins);
//       }
//       if (types.includes("teachers")) {
//         const teachers = await instructorModel.find({}, "name email educationMail");
//         recipients.push(...teachers);
//       }
//       if (types.includes("students")) {
//         let query: any = {};
//         if (subCategories?.length > 0) {
//           query.status = { $in: subCategories };
//         }
//         const students = await studentModel.find(query, "name email educationMail status");
//         recipients.push(...students);
//       }
//     }

//     if (recipients.length === 0) {
//       return NextResponse.json({ error: "No recipients found" }, { status: 404 });
//     }

//     // ✅ Fake sending — just log results
//     const dbTemplate = { subject, bodyHtml };
//     if (!validateTemplate(dbTemplate.bodyHtml, REQUIRED_FIELDS)) {
//       return NextResponse.json({ error: "Template missing required fields" }, { status: 400 });
//     }

//     const sendResults = [];
//     for (const user of recipients) {
//       try {
//         const renderedSubject = renderTemplate(dbTemplate.subject, user);
//         const renderedHtml = renderTemplate(dbTemplate.bodyHtml, user);

//         console.log("📧 [TEST SEND] -------------------");
//         console.log("To:", user.email);
//         console.log("Subject:", renderedSubject);
//         console.log("HTML:", renderedHtml.substring(0, 200) + "..."); // truncate preview
//         console.log("---------------------------------");

//         sendResults.push({ email: user.email, status: "simulated" });
//       } catch (err: any) {
//         sendResults.push({ email: user.email, status: "failed", error: err?.message });
//       }
//     }

//     return NextResponse.json({
//       message: `Simulation complete: ${sendResults.length} emails prepared`,
//       results: sendResults,
//     });
//   } catch (err: any) {
//     console.error("❌ Custom email simulation failed:", err);
//     return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
//   }
// }
