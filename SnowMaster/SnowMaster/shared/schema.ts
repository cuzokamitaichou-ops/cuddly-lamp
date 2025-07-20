import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Discord user ID
  username: text("username").notNull(),
  role: text("role").notNull(), // "owner" or "co-owner"
  createdAt: timestamp("created_at").defaultNow(),
});

export const botSettings = pgTable("bot_settings", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  bio: text("bio").notNull(),
  status: text("status").notNull(), // "online", "offline", "dnd"
  customStatus: text("custom_status"),
  avatar: text("avatar"),
  banner: text("banner"),
  token: text("token").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiSettings = pgTable("ai_settings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  vibe: text("vibe").notNull(),
  theme: text("theme").notNull(),
  responseSpeed: text("response_speed").notNull(),
  securityLevel: text("security_level").notNull(),
  personalityTraits: jsonb("personality_traits").$type<string[]>().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blacklistedUsers = pgTable("blacklisted_users", {
  id: text("id").primaryKey(), // Discord user ID
  username: text("username").notNull(),
  reason: text("reason").notNull(),
  blacklistedAt: timestamp("blacklisted_at").defaultNow(),
});

export const botStats = pgTable("bot_stats", {
  id: serial("id").primaryKey(),
  servers: integer("servers").notNull(),
  users: integer("users").notNull(),
  commands: integer("commands").notNull(),
  blacklisted: integer("blacklisted").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
});

export const insertBotSettingsSchema = createInsertSchema(botSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertAiSettingsSchema = createInsertSchema(aiSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertBlacklistedUserSchema = createInsertSchema(blacklistedUsers).omit({
  blacklistedAt: true,
});

export const insertBotStatsSchema = createInsertSchema(botStats).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type BotSettings = typeof botSettings.$inferSelect;
export type InsertBotSettings = z.infer<typeof insertBotSettingsSchema>;
export type AiSettings = typeof aiSettings.$inferSelect;
export type InsertAiSettings = z.infer<typeof insertAiSettingsSchema>;
export type BlacklistedUser = typeof blacklistedUsers.$inferSelect;
export type InsertBlacklistedUser = z.infer<typeof insertBlacklistedUserSchema>;
export type BotStats = typeof botStats.$inferSelect;
export type InsertBotStats = z.infer<typeof insertBotStatsSchema>;


