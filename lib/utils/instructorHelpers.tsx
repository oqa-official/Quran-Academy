import Instructor from "@/models/instructor.model";

import Counter from "@/models/counter.model";

// ✅ Atomic counter increment WITH session
export async function getNextSequence(
  name: "studentId" | "instructorId",
  session: any
) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, session }
  );

  return counter.seq;
}

// Utility: Pad number like 0001
function padNumber(num: number, length = 4) {
  return num.toString().padStart(length, "0");
}

// ✅ Generate next userId: e.g. oqa-ins-0001
export async function generateInstructorUserId(session: any) {
  const nextSeq = await getNextSequence("instructorId", session);
  return `oqa-ins-${padNumber(nextSeq)}`;
}

// ✅ Generate educationMail: fa25-0001-ins@oqa.edu.pk
export async function generateInstructorEducationMail(userId: string) {
  const year = new Date().getFullYear().toString().slice(-2);
  const term = "fa"; // later switch fa/sp/su if needed

  const num = userId.split("-")[2]; // from userId, e.g. "0005"
  return `${term}${year}-${num}-ins@oqa.edu.pk`;
}

// ✅ Generate secure password
export function generateInstructorPassword(name: string) {
  const base = name.trim().split(" ")[0];
  const randomChars = Math.random().toString(36).slice(-6);
  const specialChars = "!@#$%^&*";
  const special = specialChars[Math.floor(Math.random() * specialChars.length)];

  let password =
    base.charAt(0).toUpperCase() + base.slice(1) + randomChars + special;

  while (password.length < 12) {
    password += Math.random().toString(36).charAt(2);
  }

  return password;
}
