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
    const [keyCount, channelCount] = await Promise.all([
      prisma.apiKey.count({ where: { userId: req.userId } }),
      prisma.channel.count({ where: { userId: req.userId } })
    ]);

    res.json({
      active: keyCount + channelCount, // Approximation for active connections/usage
      msgs: Math.floor(Math.random() * 50), // Keeping a slight dynamic mock for msgs
      keys: keyCount,
      channels: channelCount
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export const statsRouter = router;
