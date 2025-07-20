import { 
  users, 
  botSettings, 
  aiSettings, 
  blacklistedUsers, 
  botStats,
  type User, 
  type InsertUser,
  type BotSettings,
  type InsertBotSettings,
  type AiSettings,
  type InsertAiSettings,
  type BlacklistedUser,
  type InsertBlacklistedUser,
  type BotStats,
  type InsertBotStats
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Bot settings methods
  getBotSettings(): Promise<BotSettings | undefined>;
  updateBotSettings(settings: InsertBotSettings): Promise<BotSettings>;
  
  // AI settings methods
  getAiSettings(): Promise<AiSettings | undefined>;
  updateAiSettings(settings: InsertAiSettings): Promise<AiSettings>;
  
  // Blacklist methods
  getBlacklistedUsers(): Promise<BlacklistedUser[]>;
  addToBlacklist(user: InsertBlacklistedUser): Promise<BlacklistedUser>;
  removeFromBlacklist(id: string): Promise<void>;
  
  // Stats methods
  getBotStats(): Promise<BotStats | undefined>;
  updateBotStats(stats: InsertBotStats): Promise<BotStats>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getBotSettings(): Promise<BotSettings | undefined> {
    const [settings] = await db.select().from(botSettings).limit(1);
    return settings || undefined;
  }

  async updateBotSettings(settings: InsertBotSettings): Promise<BotSettings> {
    // First try to update existing settings
    const existing = await this.getBotSettings();
    
    if (existing) {
      const [updated] = await db
        .update(botSettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(botSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new settings if none exist
      const [created] = await db
        .insert(botSettings)
        .values({ ...settings, updatedAt: new Date() })
        .returning();
      return created;
    }
  }

  async getAiSettings(): Promise<AiSettings | undefined> {
    const [settings] = await db.select().from(aiSettings).limit(1);
    return settings || undefined;
  }

  async updateAiSettings(settings: InsertAiSettings): Promise<AiSettings> {
    // First try to update existing settings
    const existing = await this.getAiSettings();
    
    const settingsData = {
      name: settings.name,
      age: settings.age,
      vibe: settings.vibe,
      theme: settings.theme,
      responseSpeed: settings.responseSpeed,
      securityLevel: settings.securityLevel,
      personalityTraits: Array.isArray(settings.personalityTraits) 
        ? settings.personalityTraits as string[]
        : [],
      updatedAt: new Date()
    };
    
    if (existing) {
      const [updated] = await db
        .update(aiSettings)
        .set(settingsData)
        .where(eq(aiSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new settings if none exist
      const [created] = await db
        .insert(aiSettings)
        .values(settingsData)
        .returning();
      return created;
    }
  }

  async getBlacklistedUsers(): Promise<BlacklistedUser[]> {
    return await db.select().from(blacklistedUsers);
  }

  async addToBlacklist(user: InsertBlacklistedUser): Promise<BlacklistedUser> {
    const [blacklistedUser] = await db
      .insert(blacklistedUsers)
      .values({ ...user, blacklistedAt: new Date() })
      .returning();
    return blacklistedUser;
  }

  async removeFromBlacklist(id: string): Promise<void> {
    await db.delete(blacklistedUsers).where(eq(blacklistedUsers.id, id));
  }

  async getBotStats(): Promise<BotStats | undefined> {
    const [stats] = await db.select().from(botStats).limit(1);
    if (stats) {
      // Update blacklisted count with actual count
      const blacklistedCount = await db.select().from(blacklistedUsers);
      stats.blacklisted = blacklistedCount.length;
    }
    return stats || undefined;
  }

  async updateBotStats(stats: InsertBotStats): Promise<BotStats> {
    // First try to update existing stats
    const existing = await this.getBotStats();
    
    if (existing) {
      const [updated] = await db
        .update(botStats)
        .set({ ...stats, updatedAt: new Date() })
        .where(eq(botStats.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new stats if none exist
      const [created] = await db
        .insert(botStats)
        .values({ ...stats, updatedAt: new Date() })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
