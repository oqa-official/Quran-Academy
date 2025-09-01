import twilio from "twilio";
import { NextRequest } from "next/server";

type Student = {
  name: string;
  number: string;     // E.164 with whatsapp: e.g. "whatsapp:+923001234567"
  timezone: string;   // e.g. "Asia/Karachi"
  classTime: string;  // "HH:mm" 24h, e.g. "15:00"
};

const students: Student[] = [
  { name: "Akram", number: "whatsapp:+923091403454", timezone: "Asia/Karachi", classTime: "15:00" },
  { name: "Bilal", number: "whatsapp:+923104558187", timezone: "Asia/Karachi", classTime: "20:00" },
];

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const results = [];
    for (const s of students) {
      const body = `Hi ${s.name}, your class will start in 5 minutes at ${s.classTime}`;
      const msg = await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM!,
        to: s.number,
        body,
      });
      results.push({ to: s.number, sid: msg.sid, status: msg.status });
    }
    return Response.json({ ok: true, results });
  } catch (e: any) {
    console.error(e);
    return new Response(e.message || "send error", { status: 500 });
  }
}
