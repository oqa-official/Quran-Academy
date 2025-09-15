import Counter from "@/models/counter.model";

// Utility: Pad number like 0001
function padNumber(num: number, length = 4) {
  return num.toString().padStart(length, "0");
}

// ✅ Atomic counter increment WITH session
async function getNextSequence(name: "studentId", session: any) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, session }
  );
  return counter.seq;
}

// ✅ Generate next userId: e.g. oqa-std-0001
export async function generateStudentUserId(session: any) {
  const nextSeq = await getNextSequence("studentId", session);
  return `oqa-std-${padNumber(nextSeq)}`;
}

// ✅ Generate educationMail from userId
export function generateStudentEducationMail(userId: string) {
  const year = new Date().getFullYear().toString().slice(-2);
  const term = "fa"; // e.g., fa/sp/su
  const num = userId.split("-")[2];
  return `${term}${year}-${num}-std@oqa.edu.pk`;
}

// ✅ Generate secure password
export function generatePassword(name: string) {
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
