import { DateTime } from "luxon";
import { Student } from "../types/student";



export function getClassDateTime(student: any): DateTime {
  const { hour, minute } = safeParseTimeString(
    student.preferredStartTime ? student.preferredStartTime : "9:30 AM"
  );

  return DateTime.local()
    .setZone(student.timezone)
    .set({ hour, minute, second: 0, millisecond: 0 });
}


export function safeParseTimeString(timeStr: string): { hour: number; minute: number } {
  try {
    if (!timeStr) return { hour: 9, minute: 0 };

    const [time, modifier] = timeStr.split(" "); // "9:30 AM"
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return { hour: hours, minute: minutes || 0 };
  } catch (e) {
    console.error("⚠️ Invalid time format:", timeStr);
    return { hour: 9, minute: 0 };
  }
}

// class-reminder-functions.ts
export function shouldSendReminder(student: any): { send: boolean; minutesLeft: number } {
  const { hour, minute } = safeParseTimeString(student.preferredStartTime);

  const now = new Date();
  const nowLocal = new Date(
    now.toLocaleString("en-US", { timeZone: student.timezone })
  );

  const classDateTime = new Date(nowLocal);
  classDateTime.setHours(hour, minute, 0, 0);

  const diffMs = classDateTime.getTime() - nowLocal.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  const today = nowLocal.toLocaleDateString("en-US", { weekday: "short" }); // e.g. "Fri"

  // ✅ Send if today is a class day AND between 5–30 minutes away
  const send =
    student.classDays.includes(today) && diffMinutes <= 25 && diffMinutes >= 5;

  return { send, minutesLeft: diffMinutes };
}
