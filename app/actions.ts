"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { db } from "./lib/drizzle";
import { currencies, Session, sessions } from "./lib/drizzle/schema";
import { genRandomInt } from "./lib/math";
import { levels, quiz } from "./lib/quiz";
import { getSession } from "./lib/session";

// Session
export async function assembleCode(code: string) {
  if (!code) return false;

  const payload = await db
    .select()
    .from(sessions)
    .where(eq(sessions.code, code));
  if (!payload[0]) return false;

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();

  cookieStore.set("session_code", code, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  await db
    .update(sessions)
    .set({
      status: "styling",
    })
    .returning();

  revalidatePath("/");

  return true;
}

export async function updateSessionStatus(status: Session["status"]) {
  if (!status) return false;

  const session = await getSession();
  if (!session) return false;

  const payload = await db
    .update(sessions)
    .set({
      status,
    })
    .where(eq(sessions.id, session.id))
    .returning();
  if (!payload[0]) return false;

  revalidatePath("/");

  return true;
}

// Currency
export async function createCurrency(
  name: string,
  color: number,
  format: number,
  symbol: number
) {
  const session = await getSession();
  if (!session || session.currencyId !== null) return false;

  try {
    const payload = await db
      .insert(currencies)
      .values({
        name,
        styles: [color, format, symbol],
        score: 0,
        createdBy: session.assignedCreator,
      })
      .returning();
    if (!payload[0]) return false;

    await db
      .update(sessions)
      .set({
        currencyId: payload[0].id,
      })
      .where(eq(sessions.id, session.id))
      .returning();

    return true;
  } catch (err) {
    return false;
  }
}

// Question
export async function computateQuestionResult(
  questionId: number,
  answerId: number
) {
  if (questionId === null || answerId === null) return false;

  const question = quiz[questionId];
  if (!question) return false;

  const session = await getSession();
  if (!session || session.currencyId === null) return false;

  let score = 0;
  if (question.correct_answer_index === answerId) {
    score =
      levels[question.level].score +
      genRandomInt(
        levels[question.level].randomFactor[0],
        levels[question.level].randomFactor[1]
      );
  }

  await db
    .update(currencies)
    .set({
      score: sql`${currencies.score} + ${score}`,
    })
    .where(eq(currencies.id, session.currencyId));

  if (session.questionIds.length - 1 > session.questionStepId) {
    await db
      .update(sessions)
      .set({
        questionStepId: session.questionStepId + 1,
        answers: [{ id: answerId, score }, ...session.answers],
      })
      .where(eq(sessions.id, session.id));
  } else {
    await db
      .update(sessions)
      .set({
        status: "finished",
      })
      .where(eq(sessions.id, session.id));
  }

  return score !== 0;
}

export async function revalidadeQuestions() {
  revalidatePath("/steps/questions");
}

// Login
export async function loginAsAdmin(key: string) {
  const data = await cookies();
  if (!key || key !== process.env.ADMIN_KEY) return false;

  data.set("session_admin_key", key);
  revalidatePath("/admin");

  return true;
}
