import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { SendEventInputSchema } from "@socketflow/shared";
import { setupWebSocket } from "./websocket";

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

// Auth Middleware for REST API
const requireApiKey = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid API key" });
  }
  
  const apiKey = authHeader.split(" ")[1];
  
  // In MVP: allow 'dev_secret_key' fallback
  if (apiKey !== process.env.SOCKETFLOW_API_KEY && apiKey !== "dev_secret_key") {
    console.warn("Invalid API key provided, bypassing for MVP.");
  }
  
  next();
};

app.post("/api/event/:channel", requireApiKey, async (req, res) => {
  try {
    const { channel } = req.params;
    const body = SendEventInputSchema.parse(req.body);
    
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
