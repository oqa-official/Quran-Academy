// // /app/api/whatsapp/dispatch/route.ts
// import { NextResponse } from "next/server";
// import twilio from "twilio";
// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone";

// dayjs.extend(utc);
// dayjs.extend(timezone);

// const accountSid = process.env.TWILIO_ACCOUNT_SID!;
// const authToken = process.env.TWILIO_AUTH_TOKEN!;
// const from = process.env.TWILIO_WHATSAPP_FROM!;
// const client = twilio(accountSid, authToken);

// // Mock DB
// let classes = [
//   {
//     id: 1,
//     studentName: "Ahmad",
//     studentPhone: "whatsapp:+923091403454",
//     classTime: dayjs().tz("Asia/Karachi").add(2, "minute").toISOString(),
//   },
//   {
//     id: 2,
//     studentName: "Ahmad",
//     studentPhone: "whatsapp:+923104558187",
//     classTime: dayjs().tz("Asia/Karachi").add(3, "minute").toISOString(),
//   },
// ];

// async function checkAndSend() {
//   const now = dayjs().tz("Asia/Karachi");
//   const threshold = now.add(2, "minute");

//   for (let cls of classes) {
//     const classTime = dayjs(cls.classTime).tz("Asia/Karachi");

//     if (classTime.isBefore(threshold) && classTime.isAfter(now)) {
//       await client.messages.create({
//         body: `Reminder: Your class starts at ${classTime.format("HH:mm")} 🕑`,
//         from,
//         to: cls.studentPhone,
//       });
//       console.log(`✅ Reminder sent to ${cls.studentName}`);
//     }
//   }
// }

// // run every 1 min (dev only)
// if (process.env.NODE_ENV === "development") {
//   setInterval(checkAndSend, 60 * 1000);
// }

// export async function GET() {
//   await checkAndSend();
//   return NextResponse.json({ status: "manual run" });
// }









import { NextResponse } from "next/server";
import twilio from "twilio";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with plugins for UTC and Timezone handling
dayjs.extend(utc);
dayjs.extend(timezone);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_WHATSAPP_FROM;

// Mock DB
// In a real application, you would fetch this from a database like Firestore
const classes = [
  {
    id: 1,
    studentName: "Ahmad",
    studentPhone: "whatsapp:+923091403454",
    classTime: dayjs().tz("Asia/Karachi").add(2, "minute").toISOString(),
  },
  {
    id: 2,
    studentName: "Sana",
    studentPhone: "whatsapp:+923104558187",
    classTime: dayjs().tz("Asia/Karachi").add(3, "minute").toISOString(),
  },
];

export async function GET() {
  console.log("-----------------------------------------");
  console.log("API Route Hit at:", dayjs().tz("Asia/Karachi").toISOString());

  // Check if environment variables are set
  if (!accountSid || !authToken || !from) {
    console.error("❌ Error: Missing Twilio environment variables.");
    return NextResponse.json({ error: "Missing Twilio credentials" }, { status: 500 });
  }

  const client = twilio(accountSid, authToken);
  const now = dayjs().tz("Asia/Karachi");
  
  // Define a time window for sending reminders (e.g., between 2 minutes and 1 minute before class)
  const reminderWindowStart = now.add(1, "minute");
  const reminderWindowEnd = now.add(2, "minute");

  let remindersSent = 0;
  
  // Iterate through the classes and check if a reminder should be sent
  for (let cls of classes) {
    const classTime = dayjs(cls.classTime).tz("Asia/Karachi");
    
    // Check if the class time is within the reminder window
    if (classTime.isAfter(reminderWindowStart) && classTime.isBefore(reminderWindowEnd)) {
      console.log(`⏳ Sending reminder for ${cls.studentName} at ${classTime.format("HH:mm")}`);
      try {
        await client.messages.create({
          body: `Reminder: Your class starts at ${classTime.format("HH:mm")} 🚀`,
          from,
          to: cls.studentPhone,
        });
        console.log(`✅ Reminder sent successfully to ${cls.studentName}.`);
        remindersSent++;
      } catch (error) {
        console.error(`❌ Failed to send reminder to ${cls.studentName}:`, error);
      }
    } else {
      console.log(`⏭️  Skipping ${cls.studentName}. Class is not within reminder window.`);
    }
  }

  console.log(`Total reminders sent: ${remindersSent}`);
  console.log("-----------------------------------------");

  return NextResponse.json({ status: "success", remindersSent });
}
