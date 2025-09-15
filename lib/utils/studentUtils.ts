import Student from "@/models/student.model";

// Utility: Pad number like 0001
function padNumber(num: number, length = 4) {
  return num.toString().padStart(length, "0");
}

// ✅ Generate next userId: e.g. oqastd0001, oqastd0002 ...
export async function generateUserId() {
  const lastStudent = await Student.findOne()
    .sort({ createdAt: -1 })
    .select("userId");

  if (!lastStudent || !lastStudent.userId) {
    return "oqastd0001";
  }

  // Strip "oqastd" prefix
  const lastNum = parseInt(lastStudent.userId.replace("oqastd", ""), 10) || 0;
  const nextNum = lastNum + 1;

  return `oqastd${padNumber(nextNum)}`;
}

// ✅ Generate educationMail: name0001@oqa.edu.pk
export async function generateEducationMail(name: string) {
  const firstName = name.trim().split(" ")[0].toLowerCase();

  const lastStudent = await Student.findOne()
    .sort({ createdAt: -1 })
    .select("userId");

  let nextNum = "0001";
  if (lastStudent?.userId) {
    const lastNum = parseInt(
      lastStudent.userId.replace("oqastd", ""),
      10
    );
    nextNum = String(lastNum + 1).padStart(4, "0");
  }

  return `${firstName}${nextNum}@oqa.edu.pk`;
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
  const lastStudent = await Student.findOne()
    .sort({ createdAt: -1 })
    .select("userId");

  let lastNum = lastStudent?.userId
    ? parseInt(lastStudent.userId.replace("oqastd", ""), 10)
    : 0;

  const results = [];

  for (const s of students) {
    lastNum += 1;
    const nextNum = String(lastNum).padStart(4, "0");

    const userId = `oqastd${nextNum}`;
    const firstName = s.name.trim().split(" ")[0].toLowerCase();
    const educationMail = `${firstName}${nextNum}@oqa.edu.pk`;
    const password = s.password || generatePassword(s.name);

    results.push({ userId, educationMail, password });
  }

  return results;
}

// utils/studentIds.ts (for example)
export function generateEducationMailFromUserId(userId: string, name: string) {
  const firstName = name.trim().split(" ")[0].toLowerCase();
  const num = userId.replace("oqastd", ""); // e.g. "0005"
  return `${firstName}${num}@oqa.edu.pk`;
}
