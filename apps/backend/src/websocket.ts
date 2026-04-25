import { Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function setupWebSocket(io: SocketIOServer) {
  // Middleware for auth
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error("Authentication error: Missing token"));
    }
    
    try {
      const apiKey = await prisma.apiKey.findUnique({
        where: { key: token },
        include: { user: true }
      });

      if (!apiKey) {
        return next(new Error("Authentication error: Invalid API key"));
      }

      socket.data.userId = apiKey.user.id;
      next();
    } catch (error) {
      return next(new Error("Authentication error: Server error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] Client connected: ${socket.id} (User: ${socket.data.userId})`);

    socket.on("subscribe", (data) => {
      if (typeof data.channel === "string") {
        socket.join(`channel_${data.channel}`);
        console.log(`[Socket] ${socket.id} joined channel_${data.channel}`);
        // Optional: acknowledge subscription
        socket.emit("subscribed", { channel: data.channel });
      }
    });

    socket.on("unsubscribe", (data) => {
      if (typeof data.channel === "string") {
        socket.leave(`channel_${data.channel}`);
        console.log(`[Socket] ${socket.id} left channel_${data.channel}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
}
