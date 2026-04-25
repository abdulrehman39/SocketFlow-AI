import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import crypto from "crypto";

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

const createKeySchema = z.object({
  name: z.string().min(1),
});

router.get("/", requireUser, async (req: any, res: any) => {
  try {
    const keys = await prisma.apiKey.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(keys);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch keys" });
  }
});

router.post("/", requireUser, async (req: any, res: any) => {
  try {
    const { name } = createKeySchema.parse(req.body);

    // Generate a secure API key
    const prefix = "sk_live_";
    const secret = crypto.randomBytes(32).toString("hex");
    const keyString = `${prefix}${secret}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key: keyString,
        userId: req.userId,
      },
    });

    res.status(201).json(apiKey);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Invalid input" });
  }
});

router.delete("/:id", requireUser, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await prisma.apiKey.deleteMany({
      where: {
        id,
        userId: req.userId,
      },
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete key" });
  }
});

export const keysRouter = router;
