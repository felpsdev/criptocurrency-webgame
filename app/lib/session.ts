import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "./drizzle";
import { Session, sessions } from "./drizzle/schema";

export async function getSession(): Promise<Session | null> {
  const data = await cookies();
  const code = data.get("session_code");
  if (!code) return null;

  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.code, code.value));
  if (!session[0]) return null;

  return session[0];
}

export async function sessionIsAdmin() {
  const data = await cookies();
  const code = data.get("session_admin_key");
  if (!code) return false;

  return code.value === process.env.ADMIN_KEY;
}

export async function clearSession() {
  const data = await cookies();
  data.delete("session_code");
}
