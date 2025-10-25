"use server";

import { desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "../lib/drizzle";
import { currencies, sessions } from "../lib/drizzle/schema";
import { genCode, genRandomInt } from "../lib/math";
import { quiz } from "../lib/quiz";

export async function requestSessions(offset: number = 0, limit?: number) {
  const data = await db
    .select()
    .from(sessions)
    .offset(offset)
    .limit(limit || 999999999)
    .orderBy(desc(sessions.createdAt));
  return data;
}

const currenciesRequest = db
  .select({
    ...getTableColumns(currencies),
    sessionCode: sessions.code,
    sessionAnswers: sessions.answers,
  })
  .from(currencies)
  .leftJoin(sessions, eq(currencies.id, sessions.currencyId))
  .orderBy(desc(currencies.createdAt));

export type CurrencyWithSession = Awaited<typeof currenciesRequest>[number];

export async function requestCurrencies(offset: number = 0, limit?: number) {
  const data = currenciesRequest.offset(offset).limit(limit || 999999999);
  return data;
}

function randomizeQuestions(amount: number) {
  const indexMap: Record<number, boolean> = {};

  function randomAdd(level: number) {
    const i = genRandomInt(0, quiz.length - 1);
    if (indexMap[i]) return randomAdd(level);
    indexMap[i] = true;
  }

  for (let i = 0; i < amount; i++) {
    if (i < (amount - 1) / 2) {
      randomAdd(0);
    } else {
      randomAdd(1);
    }
  }

  return Object.keys(indexMap).map((r) => parseInt(r));
}

export async function createSession(
  assignedCreator: string,
  phoneNumber: string
) {
  if (!assignedCreator || !phoneNumber) return null;

  const data = await db
    .insert(sessions)
    .values({
      code: genCode(5),
      phoneNumber,
      assignedCreator,
      status: "styling",
      questionStepId: 0,
      questionIds: randomizeQuestions(8),
      answers: [],
    })
    .returning();
  if (!data[0]) return null;

  return data[0];
}

export async function removeSession(id: number) {
  if (!id && id !== 0) return false;

  const request = await db
    .delete(sessions)
    .where(eq(sessions.id, id))
    .returning({ id: sessions.id });
  if (!request[0] || request[0].id !== id) return false;

  return true;
}

export async function removeCurrency(id: number) {
  if (!id && id !== 0) return false;

  const request = await db
    .delete(currencies)
    .where(eq(currencies.id, id))
    .returning({ id: currencies.id });
  if (!request[0] || request[0].id !== id) return false;

  return true;
}
