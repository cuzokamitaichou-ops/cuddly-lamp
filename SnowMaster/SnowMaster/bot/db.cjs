const { Pool, neonConfig } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const ws = require("ws");
const { eq } = require('drizzle-orm');

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Define schema for CommonJS
const { pgTable, serial, text, timestamp, integer } = require('drizzle-orm/pg-core');

const users = pgTable("users", {
  id: text("id").primaryKey(), // Discord user ID
  username: text("username").notNull(),
  role: text("role").notNull(), // "owner" | "co-owner"
  createdAt: timestamp("created_at").defaultNow(),
});

const botSettings = pgTable("bot_settings", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  bio: text("bio").notNull(),
  status: text("status").notNull(), // "online" | "dnd" | "offline"
  customStatus: text("custom_status"),
  avatar: text("avatar"),
  token: text("token").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const aiSettings = pgTable("ai_settings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  vibe: text("vibe").notNull(),
  traits: text("traits").array().notNull(),
  responseSpeed: text("response_speed").notNull(),
  securityLevel: text("security_level").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const blacklistedUsers = pgTable("blacklisted_users", {
  id: text("id").primaryKey(), // Discord user ID
  username: text("username").notNull(),
  reason: text("reason").notNull(),
  blacklistedAt: timestamp("blacklisted_at").defaultNow(),
});

const botStats = pgTable("bot_stats", {
  id: serial("id").primaryKey(),
  servers: integer("servers").notNull(),
  users: integer("users").notNull(),
  commands: integer("commands").notNull(),
  blacklisted: integer("blacklisted").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const schema = {
  users,
  botSettings,
  aiSettings,
  blacklistedUsers,
  botStats,
};

const db = drizzle(pool, { schema });

module.exports = { 
  db, 
  pool,
  users, 
  botSettings, 
  aiSettings, 
  blacklistedUsers, 
  botStats,
  eq
};