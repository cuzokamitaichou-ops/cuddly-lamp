import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBotSettingsSchema, insertAiSettingsSchema, insertBlacklistedUserSchema, insertBotStatsSchema } from "@shared/schema";
import { z } from "zod";

const authSchema = z.object({
  userId: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const requireOwner = async (req: any, res: any, next: any) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ message: "User ID required" });
    }
    
    const user = await storage.getUser(userId as string);
    if (!user || (user.role !== "owner" && user.role !== "co-owner")) {
      return res.status(403).json({ message: "Access denied. Owner/Co-owner only." });
    }
    
    req.user = user;
    next();
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { userId } = authSchema.parse(req.body);
      const user = await storage.getUser(userId);
      
      if (!user || (user.role !== "owner" && user.role !== "co-owner")) {
        return res.status(403).json({ message: "Access denied. Owner/Co-owner only." });
      }
      
      res.json({ user });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Bot settings routes
  app.get("/api/bot/settings", requireOwner, async (req, res) => {
    try {
      const settings = await storage.getBotSettings();
      if (!settings) {
        return res.status(404).json({ message: "Bot settings not found" });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bot settings" });
    }
  });

  app.put("/api/bot/settings", requireOwner, async (req, res) => {
    try {
      const settings = insertBotSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateBotSettings(settings);
      res.json(updatedSettings);
    } catch (error) {
      res.status(400).json({ message: "Invalid bot settings data" });
    }
  });

  // AI settings routes
  app.get("/api/ai/settings", requireOwner, async (req, res) => {
    try {
      const settings = await storage.getAiSettings();
      if (!settings) {
        return res.status(404).json({ message: "AI settings not found" });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get AI settings" });
    }
  });

  app.put("/api/ai/settings", requireOwner, async (req, res) => {
    try {
      const settings = insertAiSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateAiSettings(settings);
      res.json(updatedSettings);
    } catch (error) {
      res.status(400).json({ message: "Invalid AI settings data" });
    }
  });

  // Blacklist routes
  app.get("/api/blacklist", requireOwner, async (req, res) => {
    try {
      const blacklistedUsers = await storage.getBlacklistedUsers();
      res.json(blacklistedUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get blacklisted users" });
    }
  });

  app.post("/api/blacklist", requireOwner, async (req, res) => {
    try {
      const user = insertBlacklistedUserSchema.parse(req.body);
      const blacklistedUser = await storage.addToBlacklist(user);
      res.json(blacklistedUser);
    } catch (error) {
      res.status(400).json({ message: "Invalid blacklist data" });
    }
  });

  app.delete("/api/blacklist/:id", requireOwner, async (req, res) => {
    try {
      await storage.removeFromBlacklist(req.params.id);
      res.json({ message: "User removed from blacklist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove user from blacklist" });
    }
  });

  app.get("/api/blacklist/export", requireOwner, async (req, res) => {
    try {
      const blacklistedUsers = await storage.getBlacklistedUsers();
      const exportData = {
        blacklisted: blacklistedUsers.map(user => ({
          id: user.id,
          username: user.username,
          reason: user.reason,
          blacklistedAt: user.blacklistedAt
        })),
        exportedAt: new Date().toISOString(),
        exportedBy: (req as any).user.username
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="blacklisted.json"');
      res.json(exportData);
    } catch (error) {
      res.status(500).json({ message: "Failed to export blacklist" });
    }
  });

  // Stats routes
  app.get("/api/stats", requireOwner, async (req, res) => {
    try {
      const stats = await storage.getBotStats();
      if (!stats) {
        return res.status(404).json({ message: "Bot stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bot stats" });
    }
  });

  app.put("/api/stats", requireOwner, async (req, res) => {
    try {
      const stats = insertBotStatsSchema.parse(req.body);
      const updatedStats = await storage.updateBotStats(stats);
      res.json(updatedStats);
    } catch (error) {
      res.status(400).json({ message: "Invalid stats data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
