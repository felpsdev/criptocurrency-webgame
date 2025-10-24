import { desc } from "drizzle-orm";
import { db } from "../lib/drizzle";
import { currencies } from "../lib/drizzle/schema";

export async function fetchCurrencies() {
  const payload = await db
    .select()
    .from(currencies)
    .orderBy(desc(currencies.score));
  return payload;
}
