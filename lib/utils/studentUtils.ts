import Student from "@/models/student.model";

// Utility: Pad number like 0001
function padNumber(num: number, length = 4) {
  return num.toString().padStart(length, "0");
}

// ✅ Generate next userId: e.g. oqa-std-0001, oqa-std-0002 ...
export async function generateUserId() {
  const lastStudent = await Student.findOne().sort({ createdAt: -1 }).select("userId");

  if (!lastStudent || !lastStudent.userId) {
    return "oqa-std-0001";
  }

  const parts = lastStudent.userId.split("-");
  const lastNum = parseInt(parts[2], 10) || 0;
  const nextNum = lastNum + 1;

  return `oqa-std-${padNumber(nextNum)}`;
}

// ✅ Generate educationMail: fa25-0001-std@oqa.edu.pk
export async function generateEducationMail() {
  const year = new Date().getFullYear().toString().slice(-2);
  const term = "fa"; // you may extend to fa/su/sp if needed

  const lastStudent = await Student.findOne().sort({ createdAt: -1 }).select("userId");

  let nextNum = "0001";
  if (lastStudent?.userId) {
    const parts = lastStudent.userId.split("-");
    const lastNum = parseInt(parts[2], 10);
    nextNum = String(lastNum + 1).padStart(4, "0");
  }

  return `${term}${year}-${nextNum}-std@oqa.edu.pk`;
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

// ✅ Bulk generator for userId + educationMail
export async function generateSequentialIdsAndMails(students: any[]) {
  const year = new Date().getFullYear().toString().slice(-2);
  const term = "fa";

  const lastStudent = await Student.findOne().sort({ createdAt: -1 }).select("userId");
  let lastNum = lastStudent?.userId
    ? parseInt(lastStudent.userId.split("-")[2], 10)
    : 0;

  const results = [];

  for (const s of students) {
    lastNum += 1;
    const nextNum = String(lastNum).padStart(4, "0");

    const userId = `oqa-std-${nextNum}`;
    const educationMail = `${term}${year}-${nextNum}-std@oqa.edu.pk`;
    const password = s.password || generatePassword(s.name);

    results.push({ userId, educationMail, password });
  }

  return results;
}








// utils/studentIds.ts (for example)
export function generateEducationMailFromUserId(userId: string) {
  const year = new Date().getFullYear().toString().slice(-2);
  const term = "fa"; // fall semester
  const num = userId.split("-")[2]; // e.g. "0005"
  return `${term}${year}-${num}-std@oqa.edu.pk`;
}
