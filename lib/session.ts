import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies(); // 👈 wait for it
  const cookie = cookieStore.get("session");

  if (!cookie) return null;

  try {
    return JSON.parse(cookie.value);
  } catch {
    return null;
  }
}
