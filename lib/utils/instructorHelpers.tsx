import Instructor from "@/models/instructor.model";

// Utility: Pad number like 0001
function padNumber(num: number, length = 4) {
  return num.toString().padStart(length, "0");
}

// ✅ Generate next userId: e.g. oqathr0001, oqathr0002 ...
export async function generateInstructorUserId() {
  const lastInstructor = await Instructor.findOne()
    .sort({ createdAt: -1 })
    .select("userId");

  if (!lastInstructor || !lastInstructor.userId) {
    return "oqathr0001";
  }

  // Strip "oqathr" prefix safely
  const lastNum = parseInt(
    lastInstructor.userId.replace("oqathr", ""),
    10
  ) || 0;
  const nextNum = lastNum + 1;

  return `oqathr${padNumber(nextNum)}`;
}

// ✅ Generate educationMail: name0001@oqa.edu.pk
export async function generateInstructorEducationMail(name: string) {
  const firstName = name.trim().split(" ")[0].toLowerCase();

  const lastInstructor = await Instructor.findOne()
    .sort({ createdAt: -1 })
    .select("userId");

  let nextNum = "0001";
  if (lastInstructor?.userId) {
    const lastNum = parseInt(
      lastInstructor.userId.replace("oqathr", ""),
      10
    );
    nextNum = String(lastNum + 1).padStart(4, "0");
  }

  return `oqa.${firstName}${nextNum}@edu.pk`;
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
