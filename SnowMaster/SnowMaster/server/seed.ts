import { db } from "./db";
import { users, botSettings, aiSettings, botStats } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingUser = await db.select().from(users).limit(1);
    if (existingUser.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Add default owners
    await db.insert(users).values([
      {
        id: "1346484101388959774",
        username: "BotOwner",
        role: "owner",
      },
      {
        id: "1380607427774513152",
        username: "CoOwner",
        role: "co-owner",
      }
    ]);

    // Add default bot settings
    await db.insert(botSettings).values({
      username: "Snow",
      bio: "Your kawaii winter companion! 🌨️ I'm here to make your server magical with fun commands, AI chat, and cute personality. Always watching and ready to help! ❄️✨",
      status: "online",
      customStatus: "❄️ Spreading kawaii vibes...",
      avatar: null,
      banner: null,
      token: "MTM5NjM1NDc2Njk3NTY2ODM3NQ.Ge9-jH.72H-9iLZTs-7cbDflwM-8NCHBVMqcFbLJBAeLQ",
    });

    // Add default AI settings
    await db.insert(aiSettings).values({
      name: "Snow",
      age: 16,
      vibe: "Cute, Kawaii, Girly, Human-like",
      theme: "Cutie Soft Hearted girl / winter / yaps a lot",
      responseSpeed: "Human-like Typing Speed",
      securityLevel: "Auto-detect & Blacklist",
      personalityTraits: ["Kawaii", "Always Watching 👀", "Talkative"],
    });

    // Add default stats
    await db.insert(botStats).values({
      servers: 23,
      users: 1247,
      commands: 8341,
      blacklisted: 0,
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}