import { InferSelectModel } from "drizzle-orm";
import {
  date,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export type Currency = InferSelectModel<typeof currencies>;

export const currencies = pgTable("currencies", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  score: integer("score").notNull(),
  styles: integer("styles").array(3).notNull(),
  createdBy: varchar("created_by").notNull(),
  createdAt: date("created_at").notNull().defaultNow(),
});

export const sessioStatusEnum = pgEnum("status", [
  "styling",
  "answering",
  "finished",
]);

export type Session = InferSelectModel<typeof sessions>;

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  code: varchar("code").unique().notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  assignedCreator: varchar("assigned_creator").notNull(),
  status: sessioStatusEnum("status").notNull(),
  currencyId: integer("currency_id").references(() => currencies.id),
  answers: json("answers").array().notNull(),
  questionStepId: integer("question_step_id").notNull(),
  questionIds: integer("question_ids").array().notNull(),
  createdAt: date("created_at").notNull().defaultNow(),
});
