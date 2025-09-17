import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sender: text("sender").notNull(),
  content: text("content").notNull(),
  isEncrypted: boolean("is_encrypted").notNull().default(true),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  cipherKey: text("cipher_key"),
  startNumber: integer("start_number"),
  reverseGroups: boolean("reverse_groups").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
}).extend({
  sender: z.string().min(1),
  content: z.string().min(1),
  isEncrypted: z.boolean().default(true),
  cipherKey: z.string().optional(),
  startNumber: z.number().optional(),
  reverseGroups: z.boolean().default(false),
});

export const cipherRequestSchema = z.object({
  text: z.string().min(1),
  key: z.string().min(3).regex(/^[A-Z]+$/, "Key must contain only uppercase letters A-Z"),
  startNumber: z.number().int(),
  reverseGroups: z.boolean().default(false),
  operation: z.enum(["encrypt", "decrypt"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type CipherRequest = z.infer<typeof cipherRequestSchema>;
