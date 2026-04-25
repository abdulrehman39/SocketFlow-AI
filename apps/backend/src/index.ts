import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { SendEventInputSchema } from "@socketflow/shared";
import { setupWebSocket } from "./websocket";

import { authRouter } from "./routes/auth";
import { keysRouter } from "./routes/keys";
import { statsRouter } from "./routes/stats";
import { channelsRouter } from "./routes/channels";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// Setup websocket handlers
setupWebSocket(io);

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Register routers
app.use("/api/auth", authRouter);
app.use("/api/keys", keysRouter);
app.use("/api/stats", statsRouter);
app.use("/api/channels", channelsRouter);

// Auth Middleware for REST API using API Keys
const requireApiKey = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid API key" });
  }
  
  const apiKeyStr = authHeader.split(" ")[1];
  
  try {
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: apiKeyStr },
      include: { user: true }
    });

    if (!apiKey) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    req.user = apiKey.user;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Authentication error" });
  }
};

app.post("/api/event/:channel", requireApiKey, async (req, res) => {
  try {
    const { channel } = req.params;
    const body = SendEventInputSchema.parse(req.body);
    const userId = (req as any).user.id;
    
    try {
      await prisma.channel.upsert({
        where: {
          userId_name: {
            userId: userId,
            name: channel
          }
        },
        update: {},
        create: {
          name: channel,
          userId: userId
        }
      });
    } catch (e) {
      console.error("Failed to save channel on broadcast", e);
    }
    
    // Broadcast to the channel using Socket.io Hub
    io.to(`channel_${channel}`).emit("message", {
      channel,
      type: body.type,
      data: body.data,
      user_id: body.user_id,
      timestamp: new Date().toISOString()
    });

    res.json({
      status: "delivered",
      message_id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Invalid payload" });
  }
});

app.post("/api/broadcast", requireApiKey, async (req, res) => {
  try {
    const { type, data } = req.body;
    
    io.emit("message", {
      type,
      data,
      timestamp: new Date().toISOString()
    });
    
    res.json({ status: "broadcasted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/metrics", requireApiKey, async (req, res) => {
  try {
    const sockets = await io.fetchSockets();
    res.json({
      active_connections: sockets.length,
      // mock metrics for MVP
      messages_per_minute: Math.floor(Math.random() * 100),
      avg_latency_ms: Math.floor(Math.random() * 50),
      error_rate: 0.002
    });
  } catch(error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 SocketFlow Backend running on port ${PORT}`);
});
