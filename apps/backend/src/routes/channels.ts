import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// In a real app, this middleware would verify the JWT
const requireUser = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }
  
  const token = authHeader.split(" ")[1];
  try {
    const jwt = require("jsonwebtoken");
    const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_for_dev";
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

router.get("/", requireUser, async (req: any, res: any) => {
  try {
    const channels = await prisma.channel.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    
    // We add a mock "active subscribers" count for the dashboard since
    // actual socket IO rooms across multiple nodes requires a Redis adapter.
    // In MVP, we mock the active count for UI purposes.
    const enhancedChannels = channels.map(ch => ({
      ...ch,
      subscribers: Math.floor(Math.random() * 50)
    }));

    res.json(enhancedChannels);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch channels" });
  }
});

export const channelsRouter = router;
