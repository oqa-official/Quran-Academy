import Instructor from "@/models/instructor.model";

// Utility: Pad number like 0001
function padNumber(num: number, length = 4) {
  return num.toString().padStart(length, "0");
}

// ✅ Generate next userId: e.g. oqa-ins-0001
export async function generateInstructorUserId() {
  const lastInstructor = await Instructor.findOne().sort({ createdAt: -1 }).select("userId");

  if (!lastInstructor || !lastInstructor.userId) {
    return "oqa-ins-0001";
  }

  const parts = lastInstructor.userId.split("-");
  const lastNum = parseInt(parts[2], 10) || 0;
  const nextNum = lastNum + 1;

  return `oqa-ins-${padNumber(nextNum)}`;
}

// ✅ Generate educationMail: fa25-0001-ins@oqa.edu.pk
export async function generateInstructorEducationMail() {
  const year = new Date().getFullYear().toString().slice(-2);
  const term = "fa"; // later you can switch fa/sp/su

  const lastInstructor = await Instructor.findOne().sort({ createdAt: -1 }).select("userId");

  let nextNum = "0001";
  if (lastInstructor?.userId) {
    const parts = lastInstructor.userId.split("-");
    const lastNum = parseInt(parts[2], 10);
    nextNum = String(lastNum + 1).padStart(4, "0");
  }

  return `${term}${year}-${nextNum}-ins@oqa.edu.pk`;
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
